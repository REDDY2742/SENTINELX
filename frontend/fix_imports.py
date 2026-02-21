import os, re, glob

api_import = "import { API_BASE_URL } from '@/lib/api';"

# Find all TSX/TS files that use API_BASE_URL
files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
files = [f for f in files if 'api.ts' not in f and 'node_modules' not in f]

fixed = 0
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as fh:
        content = fh.read()

    if 'API_BASE_URL' not in content:
        continue

    # Remove ALL existing API_BASE_URL import lines (wherever they are, even misplaced)
    content_clean = re.sub(r"import \{ API_BASE_URL \} from '@/lib/api';\r?\n?", '', content)

    # Split lines (normalize line endings)
    lines = content_clean.replace('\r\n', '\n').split('\n')

    # Find where all top-level imports end (handles multi-line imports too)
    last_import_end = -1
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if lines[i].startswith('import '):
            last_import_end = i
            # Multi-line import: keep going until closing brace
            if '{' in stripped and '}' not in stripped:
                i += 1
                while i < len(lines) and '}' not in lines[i]:
                    i += 1
                last_import_end = i
        i += 1

    if last_import_end >= 0:
        lines.insert(last_import_end + 1, api_import)
        new_content = '\r\n'.join(lines)
        with open(filepath, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        fixed += 1
        print(f'Fixed: {os.path.basename(filepath)}')

print(f'\nTotal files fixed: {fixed}')
