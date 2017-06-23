import json
import requests
SUPPORTED_PRODUCTS = [
"Annual LLS Membership (needed for all events)",

]

def main(api_path):
    line_items = requests.get("{a}/line_items".format(a=api_path)).json()
    for line_item in line_items:
        if line_item["item"] in SUPPORTED_PRODUCTS:
            order = requests.get("{a}/orders/orderNumber/{n}".format(a=api_path, n=line_item["orderId"])).json()
            if order["memberNumber"] == -1:
                result = requests.get("{a}/member/orderNumber/{n}".format(a=api_path, n=line_item["orderId"]));
                if result.status_code != 200:
                    print ("an error occured resolving member for Order {o}".format(o=order["ssOrderId"]))
                    continue



if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires api location")
    main(sys.argv[1])
