def recusively_extract_value(row):
    try:
        #the values are always stored into the 2nd key of the json object
        return recusively_extract_value(row[list(row.keys())[1]])
    except:
        return row

def format_row(row):
    try:
        temp = dict(row)
        return recusively_extract_value(temp[list(temp.keys())[1]])
    except:
        return 0
    
def format_pd(df):
    temp = df.copy()
    for col in df.columns[2:]:
        temp[col] = temp[col].apply(lambda row: format_row(row) )
    return temp