import { IItemRow, IPdfQuoteResponse } from "./types";
import { findGetParameter } from "./util";
import { loadConfig } from "./config";

interface IPdfAddressing extends HTMLFormElement {
    receiver:       HTMLInputElement,
    attentionOf:    HTMLInputElement,
    street:         HTMLInputElement,
    postalCode:     HTMLInputElement,
    city:           HTMLInputElement,
    country:        HTMLInputElement
}

interface IPdfDetails extends HTMLFormElement {
    quoteId:        HTMLInputElement,
    creationDate:   HTMLInputElement,
    expiryDate:     HTMLInputElement,
    contactPerson:  HTMLInputElement,
    debitId:        HTMLInputElement,
    reference:      HTMLInputElement,
    topic:          HTMLInputElement
}

interface IdResponse {
    id: string
}

class HTMLIndexedElement extends HTMLTableRowElement {
    index: number
}

export async function loadQuotePage() {
    let quoteId = findGetParameter("quoteId");
    let newQuote = findGetParameter("new");
    if(quoteId == null) {
        if(newQuote != null) {

        } else {
            window.location.href = "quotes.html";
            return;
        }
    }

    if(newQuote == null) {
        document.getElementById("pdfPageTitle").innerHTML = "Edit Quote";

        let quoteJson = window.localStorage.getItem("quote-" + quoteId);
        if(quoteJson == null) {
            window.location.href = "quotes.html";
            return;
        }

        let quote = <IPdfQuoteResponse> JSON.parse(quoteJson);
        const PDF_ADDRESSING = <IPdfAddressing> document.getElementById('pdfAddressing');
        const PDF_DETAILS = <IPdfDetails> document.getElementById('pdfDetails');
    
        PDF_ADDRESSING.receiver.value = quote.receiver;
        PDF_ADDRESSING.attentionOf.value = quote.attentionOf;
        PDF_ADDRESSING.street.value = quote.address.street;
        PDF_ADDRESSING.postalCode.value = quote.address.postalCode;
        PDF_ADDRESSING.city.value = quote.address.city;
        PDF_ADDRESSING.country.value = quote.address.country;
    
        PDF_DETAILS.quoteId.value = quote.id.toString();
    
        let creationDate = new Date(quote.creationDate);
        PDF_DETAILS.creationDate.value =
            creationDate.getFullYear() + "-" + 
            (((creationDate.getMonth() + 1) < 10) ? "0" + (creationDate.getMonth() + 1) : creationDate.getMonth() +1) + "-" + 
            (creationDate.getDate() < 10 ? "0" + creationDate.getDate() : creationDate.getDate());
        
        let expiryDate = new Date(quote.creationDate);
        PDF_DETAILS.expiryDate.value = 
            expiryDate.getFullYear() + "-" + 
            (((expiryDate.getMonth() + 1) < 10) ? "0" + (expiryDate.getMonth() + 1) : expiryDate.getMonth() +1) + "-" + 
            (expiryDate.getDate() < 10 ? "0" + expiryDate.getDate() : expiryDate.getDate());
    
        PDF_DETAILS.contactPerson.value = quote.quoteContactPerson;
        PDF_DETAILS.debitId.value = quote.debitId;
        PDF_DETAILS.reference.value = quote.reference;
        PDF_DETAILS.topic.value = quote.quoteTopic;
        
        drawProductsTable(quote.rows);
    } else {
        document.getElementById("pdfPageTitle").innerHTML = "New Quote";

        let cfg = await loadConfig();
        let newQuoteIdReq = $.ajax({
            url: cfg.host + "/id/quote",
            method: "GET"
        });

        newQuoteIdReq.then((e: IdResponse) => {
            const PDF_DETAILS = <IPdfDetails> document.getElementById('pdfDetails');
            PDF_DETAILS.quoteId.value = e.id;
            
        });
    }
}

function drawProductsTable(products: IItemRow[]) {
    const PDF_PRODUCTS = <HTMLTableElement> document.getElementById('pdfProducts');

    for(let i = 0; i < products.length; i++) {
        let itemRow = products[i];
        let tableRow = <HTMLIndexedElement> PDF_PRODUCTS.insertRow();
        
        let indexInput = document.createElement('input');
        indexInput.type = "number";
        indexInput.name = "index";

        indexInput.value = (i+1).toString();
        itemRow.index = i;
        tableRow.setAttribute("data-order-index", i.toString());

        indexInput.min = "1";
        tableRow.index = i;
        indexInput.classList.value = "singleChar";
        indexInput.addEventListener("change", (_e) => {
            let oldIndex = tableRow.index;
            let newIndex = Number.parseInt(indexInput.value) -1;

            //Old index is smaller, so the item moved up the list
            if(oldIndex < newIndex && newIndex != 0) {
                let prevSibling = <HTMLIndexedElement> PDF_PRODUCTS.querySelector('[data-order-index="' + newIndex + '"]');
                prevSibling.index = oldIndex -1;
                prevSibling.getElementById() = oldIndex.toString();
                prevSibling.setAttribute('data-order-index', (oldIndex -1).toString());

                indexInput.index = newIndex +1;
                indexInput.value = newIndex.toString();
                indexInput.setAttribute('data-order-index', (newIndex +1).toString());

                console.log(indexInput.index);
                console.log(prevSibling.index);

                // item (input) -> td -> tr
                PDF_PRODUCTS.tBodies[0].insertBefore(indexInput.parentElement.parentElement, prevSibling);
                
                prevSibling.style.backgroundColor = "red";
                indexInput.style.backgroundColor = "green";
            }

        });

        let indexCell = document.createElement('td');
        indexCell.appendChild(indexInput);
        tableRow.appendChild(indexCell);

        let productIdInput = document.createElement('input');
        productIdInput.type = "text";
        productIdInput.name = "productId"
        productIdInput.value = itemRow.id;
        let productIdCell = document.createElement('td');
        productIdCell.appendChild(productIdInput);
        tableRow.appendChild(productIdCell);

        let descriptionInput = document.createElement('input');
        descriptionInput.type = "text";
        descriptionInput.name = "description"
        descriptionInput.value = itemRow.description;
        let descriptionCell = document.createElement('td');
        descriptionCell.appendChild(descriptionInput);
        tableRow.appendChild(descriptionCell);

        let quantityInput = document.createElement('input');
        quantityInput.type = "number";
        quantityInput.name = "quantity"
        quantityInput.value = itemRow.quantity.toString();
        quantityInput.min = "1";
        let quantityCell = document.createElement('td');
        quantityCell.appendChild(quantityInput);
        tableRow.appendChild(quantityCell);

        let priceInput = document.createElement('input');
        priceInput.type = "number";
        priceInput.name = "price"
        priceInput.value = itemRow.price.toString();
        let priceCell = document.createElement('td');
        priceCell.appendChild(priceInput);
        tableRow.appendChild(priceCell);

        let discountInput = document.createElement('input');
        discountInput.type = "number";
        discountInput.name = "discount"
        discountInput.value = itemRow.discountPerc.toFixed(1).toString();
        let discountCell = document.createElement('td');
        discountCell.appendChild(discountInput);
        tableRow.appendChild(discountCell);
    
        let amountCell = document.createElement('td');
        amountCell.innerHTML = (itemRow.price * (100.0 - itemRow.discountPerc)/100.0).toFixed(2).toString();
        tableRow.appendChild(amountCell);

        let vatInput = document.createElement('input');
        vatInput.type = "number";
        vatInput.name = "vat"
        vatInput.value = itemRow.vatPerc.toFixed(1).toString();
        let vatCell = document.createElement('td');
        vatCell.appendChild(vatInput);
        tableRow.appendChild(vatCell);

        let totalCell = document.createElement('td');
        totalCell.innerHTML = (itemRow.price + (100.0 - itemRow.discountPerc)/100.0 * itemRow.quantity).toFixed(2).toString();
        tableRow.appendChild(totalCell);
    }
}