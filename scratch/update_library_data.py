import re

def run():
    # 1. Read the TS snippet
    with open('scratch/ts_books_snippet.txt', 'r', encoding='utf-8') as f:
        books_code = f.read()
        
    # 2. Read the library-data.ts file
    ts_path = 'src/lib/library-data.ts'
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 3. Locate the Books marker and Films marker
    start_marker = '  // ── Books ──────────────────────────────────────────────────────────'
    end_marker = '  // ── Films ──────────────────────────────────────────────────────────'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Error: Markers not found. Start: {start_idx}, End: {end_idx}")
        return
        
    # Replace content between markers
    # Keep the markers and add the code in between
    new_content = (
        content[:start_idx + len(start_marker)] + 
        '\n' + books_code + ',\n\n' + 
        content[end_idx:]
    )
    
    # 4. Write back to library-data.ts
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Successfully updated {ts_path} with Goodreads books.")

if __name__ == '__main__':
    run()
