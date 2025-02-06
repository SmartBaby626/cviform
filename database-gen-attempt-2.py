QNumFormArray = []
QNumInvArray = []
dotpointsArray = []
while True:
    QNumForm = input("Question number as it appears on online form (or type pushCompleted to finish):")
    if QNumForm == "pushCompleted":
        break
    QNumInv = input("Question number as it appears on cvi inventory document:")
    print("Paste dotpoints then press Ctrl+C")
    contents = []
    while True:
        try:
            line = input()
        except KeyboardInterrupt:
            break
        contents.append(line)



    grouped_items = []
    current_group = []

    for item in contents:
        if item.startswith('\uf0b7'):
            if current_group:
                grouped_items.append(' '.join(current_group))  # Save previous group
            current_group = [item.lstrip('\uf0b7').strip()]  # Start new group, remove bullet
        else:
            current_group.append(item.strip())  # Append to current group

    if current_group:
        grouped_items.append(' '.join(current_group))  # Add the last group
    
    QNumFormArray.append(QNumForm)
    QNumInvArray.append(QNumInv)
    dotpointsArray.append(grouped_items)
