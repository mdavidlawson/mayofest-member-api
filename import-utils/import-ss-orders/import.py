import sys
import csv
import json
import requests
import time
orders = {}
translated_line_items = []

def main(orders_csv_path, api_path):

    if not orders_csv_path:
        raise RuntimeError("Orders path not specified")
    print ("Attempting to open {file}".format(file=orders_csv_path))
    with open(orders_csv_path, 'r') as orderscsv:
        raw_orders_csv = csv.DictReader(orderscsv, delimiter=',', quotechar='"')
        line_items = list(raw_orders_csv)
    if not raw_orders_csv:
        raise RuntimeError("Could not find / parse line_items file!")
    print("Orders read in from file. Beginning to process Orders")
    if not line_items or len(line_items) <= 1:
        print("Empty order list, taking no action")
        exit(0)
    global orders
    global line_items
    for item in line_items:
        order = _translate_order(item)
        _check_add_order(order)
        line_item = _translate_line_item(item)
        translated_line_items.append(line_item)

    for translated_item in translated_line_items:
        #time.sleep(.1)
        order = orders[translated_item["orderId"]]
        found_order = requests.get("{p}/order/orderNumber/{ssId}".format(p=api_path,ssId=order["ssOrderId"])).json()
        if not found_order or found_order == "null":
            result = requests.post(api_path+"/order", data=order)
            if result.status_code != 200:
                print ("Failed to add order: {o} Reason: {r}".format(o=order["ssOrderId"], r=result.text))
                continue
            else:
                print ("Added new order: " + result.json()._id)
        else:
            print ("skipping already added order: {o}".format(o=order["ssOrderId"]))

def _check_add_order(order):
    global orders
    #print json.dumps(order, indent=2)
    if order["ssOrderId"] in orders:
        return
    orders[order["ssOrderId"]] = order


def _translate_order(item):
    return {
        "ssOrderId": int(item["Order ID"]),
        "memberNumber": -1,
        "timestamp": item["Paid at"]
    }

def _translate_line_item(item):
    return {
        "orderId": int(item["Order ID"]),
        "item": item["Lineitem name"],
        "qty": item["Lineitem quantity"],
        "price": item["Lineitem price"],
        "fufillmentStatus": item["Fulfillment Status"]
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires path to orders file")
    main(sys.argv[1], sys.argv[2])
