# utils/geocode.py
import httpx
from functools import lru_cache

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"

@lru_cache(maxsize=500)          # avoid duplicate lookups
def reverse_geocode(lat: float, lng: float) -> str | None:
    """
    Return a human‑readable address string for given coordinates,
    or None if the service fails.
    """
    try:
        params = {
            "lat": lat,
            "lon": lng,
            "format": "json",
            "zoom": 14,          # 14 ≈ neighbourhood level
        }
        headers = {"User-Agent": "LogiGuardians/1.0 (contact@example.com)"}
        r = httpx.get(NOMINATIM_URL, params=params, headers=headers, timeout=5)
        r.raise_for_status()
        data = r.json()
        return data.get("display_name")
    except Exception as e:
        print("reverse_geocode error:", e)
        return None
