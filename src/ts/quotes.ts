import { loadConfig } from "./config"
import { IPdfQuoteResponse } from "./types";
import { findGetParameter } from "./util";

interface IQuoteHistoryResponse {
    quotes: IPdfQuoteResponse[]
}

export async function loadQuotesPage() {
    loadQuoteHistory();

    document.getElementById("newQuoteBtn").addEventListener("click", (_e) => {
        window.location.href = "quote.html?new=1";
    });
}

async function loadQuoteHistory() {
    let cfg = await loadConfig();

    let quoteHistoryReq = $.ajax({
        url: cfg.host + "/history/quote",
        method: "GET"
    });

    let quotes = (<IQuoteHistoryResponse> await quoteHistoryReq).quotes;
    const QUOTES_TABLE = <HTMLTableElement> document.getElementById("quotes-table");

    quotes.sort((a, b) => b.creationDate - a.creationDate);
    quotes.forEach(quote => {
        let row = QUOTES_TABLE.insertRow();
        row.appendChild(createCell(quote.id));
        row.appendChild(createCell(quote.receiver));
        row.appendChild(createCell(quote.quoteTopic));
        
        let creationDate = new Date(quote.creationDate);
        row.appendChild(createCell(creationDate.getDate() + "-" + (creationDate.getMonth() +1) + "-" + creationDate.getFullYear()));        

        let expiryDate = new Date(quote.expiryDate);
        row.appendChild(createCell(expiryDate.getDate() + "-" + (expiryDate.getMonth() +1) + "-" + expiryDate.getFullYear()));

        row.addEventListener("click", (_e) => {
            window.localStorage.setItem("quote-" + quote.id.toString(), JSON.stringify(quote));
            window.location.href = "/html/quote.html?quoteId=" + quote.id;
        });
    });
}

function createCell(content: any): HTMLTableCellElement {
    let cell = document.createElement('td');
    cell.innerHTML = content.toString();
    return cell;
}