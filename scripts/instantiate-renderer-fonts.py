"""Create static TTF instances for node-canvas from bundled variable fonts.

Run this only when the source variable fonts change. Generated files are
committed/deployed so Trigger.dev never performs font conversion at runtime.
Requires the Python ``fonttools`` package.
"""

from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts"
FONT_SOURCES = ROOT / "scripts" / "font-sources"
WEIGHT_NAMES = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
}


def jobs() -> list[tuple[Path, Path, dict[str, float]]]:
    result: list[tuple[Path, Path, dict[str, float]]] = []
    families = [
        (
            "inter",
            "Inter",
            range(100, 1000, 100),
            {"opsz": 14},
            True,
        ),
        (
            "opensans",
            "OpenSans",
            range(300, 900, 100),
            {"wdth": 100},
            True,
        ),
        (
            "roboto",
            "Roboto",
            range(100, 1000, 100),
            {"wdth": 100},
            True,
        ),
        (
            "leaguespartan",
            "LeagueSpartan",
            range(100, 1000, 100),
            {},
            False,
        ),
        (
            "cormorantgaramond",
            "CormorantGaramond",
            (300, 400, 500, 600, 700),
            {},
            True,
        ),
    ]

    for folder, family, weights, other_axes, has_italic in families:
        styles = [("", "normal")]
        if has_italic:
            styles.append(("-Italic", "italic"))
        for source_suffix, style in styles:
            source_root = FONTS if family == "Inter" else FONT_SOURCES
            source = (
                source_root
                / folder
                / f"{family}{source_suffix}-Variable.ttf"
            )
            for weight in weights:
                weight_name = WEIGHT_NAMES[weight]
                file_style = (
                    "Italic"
                    if style == "italic" and weight == 400
                    else f"{weight_name}Italic"
                    if style == "italic"
                    else weight_name
                )
                output = FONTS / folder / f"{family}-{file_style}.ttf"
                result.append(
                    (source, output, {**other_axes, "wght": weight})
                )

    return result


def instantiate(job: tuple[Path, Path, dict[str, float]]) -> str:
    source, output, axes = job
    font = TTFont(source)
    instantiateVariableFont(font, axes, inplace=True, optimize=True)
    font.save(output)
    return str(output.relative_to(ROOT))


def main() -> None:
    font_jobs = jobs()
    with ProcessPoolExecutor(max_workers=4) as executor:
        for output in executor.map(instantiate, font_jobs):
            print(output)


if __name__ == "__main__":
    main()
