import os

directory = "d:/cold/src"
replacements = {
    "rgba(255, 63, 0": "rgba(var(--primary-rgb)",
    "#00D4FF": "var(--primary)",
    "#a855f7": "var(--tertiary)",
    "#A855F7": "var(--tertiary)",
    "#0055ff": "var(--secondary)",
    "rgba(0, 212, 255": "rgba(var(--primary-rgb)",
    "rgba(0, 240, 255": "rgba(var(--primary-rgb)",
    "rgba(168, 85, 247": "rgba(var(--tertiary-rgb)"
}

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith((".css", ".jsx")):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
