import json
import requests
import time
import sys
SUPPORTED_PRODUCTS = [
    "Annual LLS Membership (needed for all events)"
]
SUPPORTED_VARIATIONS = [
    "I'm not a member"
]

def main(api_path):
    orders = requests.get("{a}/orders".format(a=api_path)).json()
    for order in orders["data"]:
        if int(order["memberNumber"]) != -1:
            print "Skipping already synced order"
            continue
        line_items = requests.get("{a}/lineitem/orderNumber/{orderId}".format(a=api_path, orderId=order["ssOrderId"])).json()
        for line_item in line_items:
            print "processing line item {l}".format(l=line_item["_id"])
            if line_item["variation"] in SUPPORTED_VARIATIONS or line_item["item"] in SUPPORTED_PRODUCTS:
                print "Identified unlinked line item which is a membership linking..."
                memberData = requests.get("{a}/member/orderNumber/{orderId}".format(a=api_path, orderId=order["ssOrderId"])).json()
                if len(memberData["data"]) == 0:
                    print "Member not found at order id {o}".format(o=order["ssOrderId"])
                    continue
                member = memberData["data"][0]
                print "processing member: {m}".format(m=member["_id"])
                print member["memberNumber"]
                order["memberNumber"] = member["memberNumber"];
                resp = requests.put("{a}/order/{id}".format(a=api_path, id=order["_id"]), data=order)
                if resp.status_code != 200:
                    print ("failed to update order {o}".format(o=order["ssOrderId"]))
                    continue
                member["status"] = "ACTIVE";
                resp = requests.put("{a}/member/{id}".format(a=api_path, id=member["_id"]), data=member)
                print ("updated member {m} status to ACTIVE and order {o} member Number to {n}".format(m=member["memberNumber"], o=order["ssOrderId"], n=order["memberNumber"]))
                time.sleep(1)


    # for line_item in line_items:
    #     if line_item["item"] in SUPPORTED_PRODUCTS:
    #         order = requests.get("{a}/orders/orderNumber/{n}".format(a=api_path, n=line_item["orderId"])).json()
    #         if order["memberNumber"] == -1:
    #             result = requests.get("{a}/member/orderNumber/{n}".format(a=api_path, n=line_item["orderId"]));
    #             if result.status_code != 200:
    #                 print ("an error occured resolving member for Order {o}".format(o=order["ssOrderId"]))
    #                 continue



if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires api location")
    main(sys.argv[1])
