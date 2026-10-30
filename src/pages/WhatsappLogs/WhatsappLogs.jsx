import { useEffect, useMemo, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import { api } from "../../Api";
import "./WhatsappLogs.scss";

const PAGE_SIZE = 100;
const REFRESH_INTERVAL = 15000;
const WHATSAPP_LOGS_ENDPOINT = "api/whatsapp/whatsapp-logs";
const SAMPLE_BASE_TIME = Date.now();
const SAMPLE_LOGS = [
  {
    id: "sample-rahul-outgoing",
    clientName: "Rahul Sharma",
    phoneNumber: "+91 98765 43210",
    direction: "sent",
    message: "Hi Rahul, your tattoo consultation is confirmed for tomorrow at 4 PM.",
    status: "delivered",
    timestamp: new Date(SAMPLE_BASE_TIME - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-rahul-reply",
    clientName: "Rahul Sharma",
    phoneNumber: "+91 98765 43210",
    direction: "reply",
    message: "Thanks! I will be there.",
    timestamp: new Date(SAMPLE_BASE_TIME - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-priya-outgoing",
    clientName: "Priya Patil",
    phoneNumber: "+91 91234 56780",
    direction: "sent",
    message: "Hello Priya, please share your preferred design reference before your appointment.",
    status: "read",
    timestamp: new Date(SAMPLE_BASE_TIME - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sample-priya-reply",
    clientName: "Priya Patil",
    phoneNumber: "+91 91234 56780",
    direction: "reply",
    message: "Sure, I have sent the design. Please check.",
    timestamp: new Date(SAMPLE_BASE_TIME - 2.8 * 60 * 60 * 1000).toISOString(),
  },
];

const getLogEntries = (payload) => {
  const entries = Array.isArray(payload)
    ? payload
    : (payload?.data ?? payload?.logs ?? payload?.messages);

  if (!Array.isArray(entries)) {
    throw new Error("The WhatsApp logs response has an unexpected format.");
  }

  return entries;
};

const getDirection = (log) => {
  const direction = String(
    log.direction ?? log.messageType ?? log.type ?? log.senderType ?? "",
  ).toLowerCase();

  if (
    ["inbound", "incoming", "received", "reply", "client"].some((value) =>
      direction.includes(value),
    )
  ) {
    return "reply";
  }

  if (
    ["outbound", "outgoing", "sent"].some((value) =>
      direction.includes(value),
    )
  ) {
    return "sent";
  }

  if (log.from && !log.to) return "reply";
  if (log.to) return "sent";
  return "unknown";
};

const getPhone = (log, direction) =>
  log.client?.phone ??
  log.client?.phoneNumber ??
  log.client?.mobile ??
  log.client?.mobileno ??
  log.client?.mobileNo ??
  log.phone ??
  log.phoneNumber ??
  log.mobile ??
  log.mobileno ??
  log.mobileNo ??
  log.contacts?.[0]?.wa_id ??
  log.wa_id ??
  log.waId ??
  (direction === "sent" ? log.to ?? log.recipient : log.from) ??
  log.from ??
  log.to ??
  "";

const getClientName = (log, phone) =>
  log.client?.name ??
  log.clientName ??
  log.contactName ??
  log.contacts?.[0]?.profile?.name ??
  log.name ??
  phone ??
  "Unknown client";

const getMessage = (log) => {
  const message = log.message;
  return (
    (typeof message === "string" ? message : message?.text?.body) ??
    log.text?.body ??
    log.messages?.[0]?.text?.body ??
    log.text ??
    log.messageText ??
    message?.body ??
    log.body ??
    log.content ??
    "No message content"
  );
};

const getTimestamp = (log) =>
  log.timestamp ?? log.createdAt ?? log.date ?? log.created_at;

const toDate = (value) => {
  if (!value) return null;
  const timestamp =
    typeof value === "number" ||
    (typeof value === "string" && /^\d{10}$/.test(value))
      ? Number(value) * 1000
      : value;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatTimestamp = (value, includeDate = true) => {
  const date = toDate(value);
  if (!date) return value ? String(value) : "—";
  return includeDate
    ? date.toLocaleString()
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getLogIdentity = (log, index) =>
  log.id ?? log._id ?? log.messageId ?? log.wamid ?? `${getTimestamp(log)}-${index}`;

const buildConversations = (logs) => {
  const conversations = new Map();

  logs.forEach((log, index) => {
    const direction = getDirection(log);
    const phone = String(getPhone(log, direction));
    const identity = phone || String(log.clientId ?? log.client?.id ?? getLogIdentity(log, index));
    const conversation = conversations.get(identity) ?? {
      id: identity,
      phone,
      name: getClientName(log, phone),
      messages: [],
      latestTime: 0,
    };
    const time = toDate(getTimestamp(log))?.getTime() ?? 0;

    conversation.messages.push({ ...log, direction, _listIndex: index });
    conversation.latestTime = Math.max(conversation.latestTime, time);
    if (!conversation.phone && phone) conversation.phone = phone;
    if (
      (!conversation.name || conversation.name === conversation.phone) &&
      getClientName(log, phone)
    ) {
      conversation.name = getClientName(log, phone);
    }

    conversations.set(identity, conversation);
  });

  return Array.from(conversations.values())
    .map((conversation) => ({
      ...conversation,
      messages: conversation.messages.sort(
        (first, second) =>
          (toDate(getTimestamp(first))?.getTime() ?? 0) -
            (toDate(getTimestamp(second))?.getTime() ?? 0) ||
          first._listIndex - second._listIndex,
      ),
    }))
    .sort((first, second) => second.latestTime - first.latestTime);
};

const WhatsappLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isSampleData, setIsSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    let active = true;
    let initialLoad = true;
    let requestInFlight = false;

    const fetchLogs = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      if (initialLoad && active) setLoading(true);

      try {
        const response = await api.get(
          `${WHATSAPP_LOGS_ENDPOINT}?page=${pagination.page}&size=${PAGE_SIZE}`,
        );

        console.log(response, "response")
        const entries = getLogEntries(response?.data);
        const total = Number(response?.data?.pagination?.total ?? entries.length);
        const totalPages = Number(response?.data?.pagination?.totalPages ?? 1);

        if (active) {
          const showSamples = entries.length === 0 && total === 0;
          setIsSampleData(showSamples);
          setLogs(showSamples ? SAMPLE_LOGS : entries);
          setPagination((current) => ({
            ...current,
            total,
            totalPages: Math.max(totalPages, 1),
          }));
          setError("");
        }
      } catch (requestError) {
        if (active) {
          setIsSampleData(true);
          setLogs(SAMPLE_LOGS);
          setError(
            requestError?.response?.data?.message ??
              requestError?.message ??
              "Unable to load WhatsApp logs.",
          );
        }
      } finally {
        requestInFlight = false;
        if (active && initialLoad) {
          initialLoad = false;
          setLoading(false);
        }
      }
    };

    fetchLogs();
    const intervalId = window.setInterval(fetchLogs, REFRESH_INTERVAL);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [pagination.page]);

  const conversations = useMemo(() => buildConversations(logs), [logs]);
  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.phone}`.toLowerCase().includes(query),
    );
  }, [conversations, search]);

  const selectedConversation =
    filteredConversations.find(
      (conversation) => conversation.id === selectedId,
    ) ??
    filteredConversations[0] ??
    null;

  return (
    <MainPanel>
      <main className="whatsapp-logs-page">
        <header className="whatsapp-logs-header">
          <div>
            <h1>WhatsApp Logs</h1>
            <p>Client messages and replies from your WhatsApp number.</p>
          </div>
          <span className="whatsapp-live-indicator">Live updates · 15 sec</span>
        </header>
        {isSampleData && (
          <p className="whatsapp-sample-notice">
            Sample data for preview only — these are not real WhatsApp messages.
          </p>
        )}
        {error && conversations.length > 0 && (
          <p className="whatsapp-refresh-error">
            Could not refresh WhatsApp logs: {error}
          </p>
        )}

        <section className="whatsapp-inbox">
          <aside className="whatsapp-chat-list">
            <div className="whatsapp-chat-list-header">
              <h2>Chats</h2>
              <span>{conversations.length}</span>
            </div>
            <label className="whatsapp-search">
              <span className="visually-hidden">Search chats</span>
              <input
                type="search"
                placeholder="Search name or number"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            {loading ? (
              <p className="whatsapp-list-message">Loading chats...</p>
            ) : error && conversations.length === 0 ? (
              <p className="whatsapp-list-message whatsapp-error">{error}</p>
            ) : filteredConversations.length > 0 ? (
              <div className="whatsapp-conversation-list">
                {filteredConversations.map((conversation) => {
                  const latestMessage =
                    conversation.messages[conversation.messages.length - 1];
                  const preview = String(getMessage(latestMessage));
                  return (
                    <button
                      type="button"
                      key={conversation.id}
                      className={`whatsapp-conversation ${
                        selectedConversation?.id === conversation.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setSelectedId(conversation.id)}
                    >
                      <span className="whatsapp-avatar">
                        {conversation.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="whatsapp-conversation-details">
                        <span className="whatsapp-conversation-topline">
                          <strong>{conversation.name}</strong>
                          <time>
                            {formatTimestamp(getTimestamp(latestMessage), false)}
                          </time>
                        </span>
                        <span className="whatsapp-conversation-preview">
                          {latestMessage.direction === "sent" ? "You: " : ""}
                          {preview}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="whatsapp-list-message">
                {error || "No WhatsApp chats found."}
              </p>
            )}
            {!isSampleData && pagination.totalPages > 1 && (
              <div className="whatsapp-list-pagination">
                <button
                  type="button"
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      page: Math.max(current.page - 1, 1),
                    }))
                  }
                  disabled={pagination.page <= 1 || loading}
                >
                  Previous
                </button>
                <span>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPagination((current) => ({
                      ...current,
                      page: Math.min(
                        current.page + 1,
                        current.totalPages,
                      ),
                    }))
                  }
                  disabled={
                    pagination.page >= pagination.totalPages || loading
                  }
                >
                  Next
                </button>
              </div>
            )}
          </aside>

          <section className="whatsapp-chat-panel">
            {selectedConversation ? (
              <>
                <header className="whatsapp-chat-header">
                  <span className="whatsapp-avatar">
                    {selectedConversation.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h2>{selectedConversation.name}</h2>
                    <p>{selectedConversation.phone || "WhatsApp contact"}</p>
                  </div>
                </header>

                <div className="whatsapp-chat-messages">
                  {selectedConversation.messages.map((message, index) => (
                    <article
                      key={getLogIdentity(message, index)}
                      className={`whatsapp-bubble-row ${
                        message.direction === "sent" ? "outgoing" : "incoming"
                      }`}
                    >
                      <div className="whatsapp-bubble">
                        <p>{String(getMessage(message))}</p>
                        <span>
                          {formatTimestamp(getTimestamp(message), false)}
                          {message.direction === "sent" && message.status
                            ? ` · ${message.status}`
                            : ""}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
                <footer className="whatsapp-chat-footer">
                  Showing message history. Replies are received through your
                  WhatsApp integration.
                </footer>
              </>
            ) : (
              <div className="whatsapp-chat-placeholder">
                <span className="whatsapp-placeholder-icon">◌</span>
                <h2>Select a chat</h2>
                <p>Choose a client to view their WhatsApp conversation.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </MainPanel>
  );
};

export default WhatsappLogs;
