type StockData = {
    symbol: string
    name: string 
    shortName: string
    price: number
    currency: string
    date: string 
    change: number 
    changePercent: number
    exchange: string 
    open: number
    high: number
    low: number
    close: number
    volume: number
    quoteType?: string
}

type UserData = {
    user_id: string
    member_id: string
    name: string
}

type WatchlistData = {
    change: number,
    close: number,
    currency: string,
    date: string,
    exchange: string,
    high: number,
    low: number,
    name: string,
    shortName: string,
    open: number,
    changePercent: string,
    price: number,
    symbol: string,
    volume: number
}

type MarketData = {}

type SearchData = {
    exchange: string,
    shortname: string,
    quoteType: string,
    symbol: string,
    index: string,
    score: number,
    typeDisp: string,
    longname: string,
    exchDisp: string,
    sector: string,
    industry: string
}

type HistoryData = { 
    date: string, 
    close: string, 
    high: string, 
    low: string, 
    open: string, 
    volume: string 
}

type Recommandation = {
    bild_1: any,
    text: string,
    title: string
}

type FinancialData = (HistoryData[] | StockData);
