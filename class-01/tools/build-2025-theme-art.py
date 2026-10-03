"""Rebuild the 2025 SVG variants from the palette in assets/2025-theme.css.

Run with Python 3 from any directory. No dependencies or website build required.
The shared SVG originals also serve 2026 and are never modified here.
"""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ASSETS = Path(__file__).resolve().parents[1] / "assets"
CSS = (ASSETS / "2025-theme.css").read_text(encoding="utf-8")
OUT = ASSETS / "2025-theme"
ET.register_namespace("", "http://www.w3.org/2000/svg")
SVG = "{http://www.w3.org/2000/svg}"
HEROES = {
    "01": "logistics-network.svg", "02": "logistics-network.svg",
    "03": "warehouse-flow.svg", "04": "drone-relay.svg",
    "05": "positioning-path.svg", "06": "autonomy-city.svg",
}


def palette(number):
    rule = re.search(r'\[data-lecture="' + number + r'"\]\s*\{([^}]+)\}', CSS)
    return dict(re.findall(r'--lecture-(deep|primary|soft|accent):\s*(#[A-Fa-f0-9]{6})', rule[1]))


def save_variant(source, destination, colors, curves=False, number=None):
    tree = ET.parse(ASSETS / source)
    root = tree.getroot()
    mapping = {
        "#e7efdf": colors["soft"], "#ebf2ed": colors["soft"],
        "#faf8ef": "#FFFFFF", "#f6f8f5": "#FFFFFF",
        "#c7d8d0": "#DDE1E7", "#88aaa0": colors["primary"],
        "#244b35": colors["deep"], "#456e68": colors["primary"],
        "#9b3f2d": colors["primary"], "#c53d20": colors["accent"],
        "#d05a38": colors["accent"],
    }
    for node in root.iter():
        for attribute in ("fill", "stroke"):
            value = node.get(attribute, "").lower()
            if curves and value.startswith("#"):
                node.set(attribute, colors["accent"] if value == "#d73516" else colors["primary"])
            elif value in mapping:
                node.set(attribute, mapping[value])
        if curves and "opacity" in node.attrib:
            node.set("opacity", f'{float(node.get("opacity")) * 0.7:.3f}')
        # Tiny signal markers need a dark outline, especially lime and sky blue.
        if node.get("fill") == colors["accent"]:
            node.set("stroke", colors["deep"])
            node.set("stroke-width", "1.5")
    if number == "03":
        # Racks/infrastructure are steel; totes, robot movement and paths are amber.
        for node in root.iter():
            for attribute in ("fill", "stroke"):
                if node.get(attribute) == colors["deep"]:
                    node.set(attribute, colors["accent"])
        # The original cargo group was recolored as primary by the general map.
        for node in root.iter(SVG + "g"):
            if node.get("fill") == colors["primary"]:
                node.set("stroke", "none")
    if number == "05":
        # Neutral map infrastructure, emerald trajectory, lime observed fixes.
        roads = root.find(SVG + "g")
        roads.set("stroke", "#475569")
        paths = roads.findall(SVG + "path")
        paths[-1].set("stroke", colors["primary"])
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(ET.tostring(root, encoding="unicode") + "\n", encoding="utf-8")


for number, hero in HEROES.items():
    colors = palette(number)
    save_variant(hero, OUT / number / "hero.svg", colors, number=number)
    for part in ("intro", "students", "resources", "quiz"):
        save_variant(f"curve-{part}.svg", OUT / number / f"curve-{part}.svg", colors, curves=True)
neutral = {"primary": "#52525B", "deep": "#27272A", "soft": "#F4F4F5", "accent": "#A1A1AA"}
for part in ("home", "register"):
    save_variant(f"curve-{part}.svg", OUT / f"curve-{part}.svg", neutral, curves=True)
print("Built 32 Fall 2025 SVG variants; shared originals unchanged.")
