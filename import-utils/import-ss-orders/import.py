import sys
import csv
import json
def main(orders_csv_path):
    if not orders_csv_path:
        raise RuntimeError("Orders path not specified")
    print ("Attempting to open {file}".format(file=orders_csv_path))
    with open(orders_csv_path, 'r') as orderscsv:
        raw_orders_csv = csv.DictReader(orderscsv, delimiter=',', quotechar='"')
        orders = list(raw_orders_csv)
    if not raw_orders_csv:
        raise RuntimeError("Could not find / parse orders file!")
    print("Orders read in from file. Beginning to process Orders")
    if not orders or len(orders) <= 1:
        print("Empty order list, taking no action")
        exit(0)
    for order in orders:
        print(json.dumps(order, indent=2))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires path to orders file")
    main(sys.argv[1])
