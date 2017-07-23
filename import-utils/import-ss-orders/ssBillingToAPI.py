import sys
import csv
import json
import requests
import time
# Orders -> Line Items
bodies = {}

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
    for item in line_items:
        order = _translate_order(item)
        line_item = _translate_line_item(item)
        if order["ssOrderId"] not in bodies:
            print("{orderId} not in bodies... adding".format(orderId=order["ssOrderId"]))
            bodies[order["ssOrderId"]] = {"order": order, "lineItems": []}

        bodies[order["ssOrderId"]]["lineItems"].append(line_item)
            # add line item to existing order
    for body in bodies.values():
        order = body["order"]

        found_order = requests.get("{p}/order/orderNumber/{ssId}".format(p=api_path,ssId=order["ssOrderId"])).json()
        if not found_order or found_order == "null":
            print("About to post order: {o}".format(o=json.dumps(body, indent=2)))
            result = requests.post(api_path+"/order", json=body)
            if result.status_code != 200:
                print ("Failed to add order: {o} Reason: {r}".format(o=order["ssOrderId"], r=result.text))
                continue
            else:
                print ("Added new order + line items: " + json.dumps(result.json(), indent=2))
        else:
            print ("skipping already added order: {o}".format(o=order["ssOrderId"]))

def _translate_order(item):
    return {
        "ssOrderId": int(item["Order ID"]),
        "timestamp": item["Paid at"],
        "memberNumber": -1
    }

def _translate_line_item(item):
    return {
        "item": item["Lineitem name"],
        "qty": item["Lineitem quantity"],
        "price": item["Lineitem price"],
        "fufillmentStatus": item["Fulfillment Status"],
        "variation": item["Lineitem variant"]
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires path to orders file")
    main(sys.argv[1], sys.argv[2])
