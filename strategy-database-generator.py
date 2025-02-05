import csv

questionNum = input("Input the number of questions:")
data = [["QTitle", "Strategies"]]
while questionNum != 0:
    qtitle = input("Question Title:")
    qstrat = input("Strategies (!strategy one!!strategy two!):\n")
    data.append([qtitle, qstrat])
    questionNum -= 1
csv_file_path = "csvfile.csv"

with open(csv_file_path, mode='w', newline='') as file:
    # Create a csv.writer object
    writer = csv.writer(file)
    # Write data to the CSV file
    writer.writerows(data)

