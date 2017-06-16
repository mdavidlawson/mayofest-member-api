import sys
import csv
import json
import requests
import time
import re
def main(members_csv_path, api_path):
    if not members_csv_path:
        raise RuntimeError("Members CSV path not specified")
    print ("Attempting to open {file}".format(file=members_csv_path))
    with open(members_csv_path, 'r') as memberscsv:
        raw_members_csv = csv.DictReader(memberscsv, delimiter=',', quotechar='"')
        members = list(raw_members_csv)
    if not raw_members_csv:
        raise RuntimeError("Could not find / parse members file!")
    print("Members read in from file. Beginning to process Members")
    if not members or len(members) <= 1:
        print("Empty members list, taking no action")
        exit(0)
    for member in members:
        # translated_member =
        resolved_member = _fix_keys(member)
        translated_member = _translate_member(resolved_member)

        found_member = requests.get("{p}/member/email/{email}".format(p=api_path,email=translated_member["email"])).json()


        if len(found_member["data"]) == 0:
            result = requests.post(api_path+"/member", data=translated_member)
            if result.status_code != 200:
                print ("Failed to add member: {o} Reason: {r}".format(o=translated_member["email"], r=result.text))
                continue
            else:
                print ("Added new member: {n}".format(n=result.json()["memberNumber"]))
        else:
            print ("skipping already added member: {n}".format(n=found_member["data"][0]["memberNumber"]))

def _fix_keys(member):
    del member[""]
    #unused
    del member["Full Name"]
    return {k.translate(None, " "): v for k, v in member.items()}

def _translate_member(member):
    return {
        "name": member["FullName"],
        "email": member["Email"],
        "note": "From Google Drive Form - check if data is correct",
        "newsletterConsent": len(member["Newsletter"]) > 0,
        "addressLineA": member["AddressLine1"],
        "addressLineB": member["AddressLine2"],
        "city": member["City/Town"],
        "region": member["Province/State/Region"],
        "postalCode": member["Postal/ZipCode"],
        "country": member["Country"]
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise RuntimeError("Bad arguments: requires path to members csv file")
    main(sys.argv[1], sys.argv[2])
