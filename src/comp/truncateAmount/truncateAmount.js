export const truncateAmt = (amt)=>{
    if(amt >= 10000000){
        return (amt / 10000000).toFixed(2) + "Cr"
    }
    else if (amt >= 100000){
        return(amt / 100000).toFixed(2) + "L"
    }else{
        return amt.toLocaleString("en-IN")
    }
    }