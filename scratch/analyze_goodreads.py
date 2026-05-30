import csv

with open('goodreads_library_export.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    print("CSV Header columns:", reader.fieldnames)
    
    shelves = {}
    read_books = []
    currently_reading = []
    to_read = []
    
    for row in reader:
        shelf = row['Exclusive Shelf']
        shelves[shelf] = shelves.get(shelf, 0) + 1
        if shelf == 'read':
            read_books.append(row)
        elif shelf == 'currently-reading':
            currently_reading.append(row)
        elif shelf == 'to-read':
            to_read.append(row)
            
    print("\nShelves breakdown:")
    for k, v in shelves.items():
        print(f"  {k}: {v}")
        
    print(f"\nCurrently Reading ({len(currently_reading)}):")
    for r in currently_reading:
        print(f"  - {r['Title']} by {r['Author']}")

    print(f"\nSample Read Books (total {len(read_books)}):")
    for r in read_books[:10]:
        print(f"  - {r['Title']} by {r['Author']} (Rating: {r['My Rating']})")
