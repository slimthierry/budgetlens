"""Formatting utilities."""

from datetime import date, datetime


def format_currency(amount: float, currency: str = "EUR") -> str:
    """Format a number as currency string."""
    symbols = {
        "EUR": "\u20ac",
        "USD": "$",
        "GBP": "\u00a3",
        "CHF": "CHF",
    }
    symbol = symbols.get(currency, currency)

    if currency in ("EUR", "CHF"):
        return f"{amount:,.2f} {symbol}".replace(",", " ").replace(".", ",")
    else:
        return f"{symbol}{amount:,.2f}"


def format_percentage(value: float) -> str:
    """Format a number as percentage string."""
    return f"{value:.1f}%"


def format_date_fr(d: date | datetime) -> str:
    """Format a date in French locale style."""
    months = [
        "", "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ]
    if isinstance(d, datetime):
        d = d.date()
    return f"{d.day} {months[d.month]} {d.year}"


def format_date_short_fr(d: date | datetime) -> str:
    """Format a date in short French format."""
    months = [
        "", "janv.", "fév.", "mars", "avr.", "mai", "juin",
        "juil.", "août", "sept.", "oct.", "nov.", "déc."
    ]
    if isinstance(d, datetime):
        d = d.date()
    return f"{d.day} {months[d.month]} {d.year}"
