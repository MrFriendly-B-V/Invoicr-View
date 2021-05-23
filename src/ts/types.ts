export interface IPdfCommonResponse {
    template_name:  string,
    language:       string,
    id:             number,
    attentionOf:    string,
    receiver:       string,
    reference:      string,
    notes:          string,
    expiryDate:     number,
    creationDate:   number,
    rows:           IItemRow[],
    address:        IAddress
}

export interface IPdfQuoteResponse extends IPdfCommonResponse {
    quoteTopic:            string,
    quoteContactPerson:     string,
    debitId:               string
}

export interface IAddress {
    city:           string,
    country:        string,
    postalCode:     string,
    street:         string
}

export interface IItemRow {
    index:          number,
    comment:        string,
    id:             string,
    name:           string,
    description:    string,
    discountPerc:   number,
    vatPerc:        number,
    price:          number,
    quantity:       number
}