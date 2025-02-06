import re
rowsWithQ1 = []
rowsWithQ2 = []
questions1 = []
questions2 = []
questions3 = []
questions4 = []
questions5 = []
questions6 = []
questionsfinal = []
with open(r'strategies-at-home-4-8yrs.txt', 'r') as fp:
    lines  = fp.readlines()
    for row in lines:
        word = ';margin-bottom:.2pt'
        if row.find(word) != -1:
            rowsWithQ1.append(lines.index(row))
    
    for row in lines:
        if lines.index(row) in rowsWithQ1:
            word2 = "Strate"
            if row.find(word2) == -1:
                rowsWithQ2.append(lines.index(row))
    
    for row in lines:
        if lines.index(row) in rowsWithQ2:
            questions1.append(re.sub(r'^.*?]', ']', row))
    
    for i in questions1:
        questions2.append(re.sub(r'^.*?%', '%', i))
    
    for i in questions2:
        questions3.append(re.sub(r'^.*?!', '!', i))

    for i in questions3:
        questions4.append(re.sub(r'^.*?:', ':', i))
    
    for i in questions4:
        questions5.append((re.sub(r'^.*?>', '>', i))[1:])

    for i in questions5:
        questions6.append(i[:i.find("<")])

    print(questions6)
            