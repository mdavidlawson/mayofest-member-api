import json
import requests
import time
import sys
SUPPORTED_PRODUCTS = [
    "Annual LLS Membership (needed for all events)"
]
SUPPORTED_VARIATIONS = [
    "I'm not a member",
    "I don't have a membership"
]

def main(api_path):
    orders = requests.get("{a}/orders".format(a=api_path)).json()
    for order in orders["data"]:
        if "memberForOrder" in order and order["memberNumber"] != -1:
            print "Skipping already synced order"
            continue
        line_items = order["lineItemsForOrder"]
        for line_item in line_items:
            print "processing line item {l}".format(l=line_item["_id"])
            if line_item["variation"] in SUPPORTED_VARIATIONS or line_item["item"] in SUPPORTED_PRODUCTS:
                memberData = requests.get("{a}/member/orderNumber/{orderId}".format(a=api_path, orderId=order["ssOrderId"])).json()
                if len(memberData["data"]) == 0:
                    print "Member not found at order id {o}".format(o=order["ssOrderId"])
                    continue
                member = memberData["data"][0]
                print "processing member: {m}".format(m=member["_id"])
                print member["memberNumber"]
                updateData = {"memberNumber": int(member["memberNumber"])}
                resp = requests.put("{a}/order/{id}".format(a=api_path, id=order["_id"]), data=updateData)
                if resp.status_code != 200:
                    print ("failed to update order {o}".format(o=order["ssOrderId"]))
                    continue
                time.sleep(1)
                resp = requests.get("{a}/order/orderNumber/{id}".format(a=api_path, id=order["ssOrderId"]))
                if resp.status_code != 200 or resp.json()["memberNumber"] == -1:
                    print ("Failed to updated order! {id}".format(id=order["ssOrderId"]))
                    continue
                member["status"] = "ACTIVE"
                resp = requests.put("{a}/member/{id}".format(a=api_path, id=member["_id"]), data=member)
                if resp.status_code != 200:
                    print ("Failed to update member! " + resp.text)
                    continue
                print ("order: {m}".format(m=json.dumps(resp.json(), indent=2)))
                print ("updated member {m} status to ACTIVE and order {o} member Number to {n}".format(m=member["memberNumber"], o=order["ssOrderId"], n=updateData["memberNumber"]))
                time.sleep(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires api location")
    main(sys.argv[1])
