import csv
import re
import json

HINDI_OVERWRITES = {
    'कितने पाकिस्तान': 'kitne-pakistan',
    'गबन': 'gaban',
    'गोदान [godan]': 'godan'
}

def slugify(text):
    text_lower = text.lower().strip()
    if text_lower in HINDI_OVERWRITES:
        return HINDI_OVERWRITES[text_lower]
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

# Authors categorizations
INDIAN_AUTHORS = {
    'kamleshwar', 'premchand', 'fazil', 'ghosh', 'adiga', 'bond', 'khanna', 
    'nilekani', 'bhagat', 'lahiri', 'rushdie', 'das', 'mukherjee', 'fazal', 'kamleswar'
}

TECH_SYSTEMS_AUTHORS = {
    'bryson', 'taleb', 'isaacson', 'lynch', 'graham', 'tufte', 'bailey', 'gawande', 'thiel', 'harari'
}

PHILOSOPHY_AUTHORS = {
    'camus', 'aurelius', 'hesse', 'rilke', 'kafka', 'coelho', 'fazil', 'fazal'
}

def clean_review(review):
    if not review:
        return None
    # Remove HTML break tags
    review = re.sub(r'<br\s*/?>', ' ', review)
    # Strip whitespace
    review = review.strip()
    return review if review else None

def get_tags(title, author):
    title_lower = title.lower()
    author_lower = author.lower()
    
    tags = []
    
    # 1. Indian Literature
    is_indian = False
    for ind in INDIAN_AUTHORS:
        if ind in author_lower:
            is_indian = True
            break
    if is_indian or any(word in title_lower for word in ['godan', 'gabhan', 'gaban', 'pakistan', 'duniya', 'lakshmi', 'narmada', 'chitra', 'mirza']):
        tags.append("Indian Literature")
        
    # 2. Poetry
    if any(word in title_lower for word in ['letters', 'poet', 'poetry', 'ghazal', 'fazil', 'verse', 'duniya jise kehte hain']):
        tags.append("Poetry")
        
    # 3. Systems & Tech
    is_tech = False
    for tech in TECH_SYSTEMS_AUTHORS:
        if tech in author_lower:
            is_tech = True
            break
    if is_tech or any(word in title_lower for word in ['quantitative', 'information', 'design', 'systems', 'hitchhiker', 'jobs', 'productivity', 'zero to one', 'randomness', 'checklists', 'checklist', 'investor', 'financial']):
        tags.append("Technology")
        tags.append("Systems")
        if 'design' in title_lower or 'visual' in title_lower:
            tags.append("Design")
            
    # 4. Philosophy & Existentialism
    is_phil = False
    for phil in PHILOSOPHY_AUTHORS:
        if phil in author_lower:
            is_phil = True
            break
    if is_phil or any(word in title_lower for word in ['stranger', 'metamorphosis', 'meditations', 'siddhartha', 'quality', 'zen', 'existentialism', 'alchemist']):
        tags.append("Philosophy")
        if any(word in title_lower for word in ['stranger', 'metamorphosis', 'existentialism', 'death of ivan']):
            tags.append("Existentialism")
            
    # 5. History & Civilization
    if any(word in title_lower for word in ['history', 'sapiens', 'deus', 'civilization', 'hiroshima', 'einstein', 'da vinci', 'trilogy', 'giants', 'winter of the world', 'emperor', 'maladies', 'gene']):
        tags.append("History")
        tags.append("Civilization")
        
    # Fallback to general Literature & Fiction tags
    if not tags:
        tags.append("Literature")
        
    # Cross tag cleanup/enrichment
    if "Literature" not in tags and not any(t in tags for t in ["Technology", "Systems", "Design"]):
        tags.append("Literature")
        
    # Add memory/solitude keywords
    if any(word in title_lower for word in ['solitude', 'loneliness', 'midnight', 'stranger', 'quiet', 'time', 'wood', 'memory']):
        tags.append("Solitude")
        tags.append("Memory")
        
    return list(set(tags))

def run():
    books = []
    currently_reading = None
    
    with open('goodreads_library_export.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            shelf = row['Exclusive Shelf']
            if shelf not in ['read', 'currently-reading']:
                continue
                
            title = row['Title']
            # Clean up series titles like "Shōgun (Asian Saga, #1)"
            title_clean = re.sub(r'\s*\([^)]*\)$', '', title).strip()
            
            author = row['Author']
            book_id = slugify(title_clean)
            
            year = row['Original Publication Year'] or row['Year Published']
            if not year or year == '0':
                year = None
            else:
                year = str(int(float(year))) # clean floats
                
            note = clean_review(row['My Review'])
            tags = get_tags(title_clean, author)
            
            book_item = {
                'id': book_id,
                'title': title_clean,
                'creator': author,
                'type': 'book',
                'tags': tags,
                'year': year,
                'note': note
            }
            
            if shelf == 'currently-reading':
                currently_reading = book_item
            else:
                books.append(book_item)
                
    # Sort read books by year decending
    books.sort(key=lambda x: x['year'] or '0000', reverse=True)
    
    print(f"Processed {len(books)} read books and found currently-reading: {currently_reading['title'] if currently_reading else 'None'}")
    
    # 1. Update current-reading.json
    if currently_reading:
        # Load current json
        cr_path = 'content/library/current-reading.json'
        with open(cr_path, 'r') as cr_f:
            cr_data = json.load(cr_f)
            
        # Update reading
        cr_data['reading'] = {
            'title': currently_reading['title'],
            'author': currently_reading['creator'],
            'note': currently_reading['note'] or "Exploring pages of history and human resilience."
        }
        
        with open(cr_path, 'w') as cr_f:
            json.dump(cr_data, cr_f, indent=2, ensure_ascii=False)
        print(f"Updated {cr_path} with: {currently_reading['title']}")
        
    # 2. Output TS code
    # We will format this into a string to insert into library-data.ts
    ts_items = []
    for b in books:
        # Format tags
        tags_str = ", ".join([f'"{t}"' for t in b['tags']])
        # Format note
        note_line = f',\n    note: {json.dumps(b["note"])}' if b['note'] else ''
        year_line = f',\n    year: "{b["year"]}"' if b['year'] else ''
        ts_item = f"""  {{
    id: "{b['id']}",
    title: "{b['title']}",
    creator: "{b['creator']}",
    type: "book",
    tags: [{tags_str}]{year_line}{note_line}
  }}"""
        ts_items.append(ts_item)
        
    ts_code = ",\n".join(ts_items)
    
    # Save the TS code snippet to a scratch file
    with open('scratch/ts_books_snippet.txt', 'w') as f_out:
        f_out.write(ts_code)
    print("TypeScript code snippet saved to scratch/ts_books_snippet.txt")

if __name__ == '__main__':
    run()
