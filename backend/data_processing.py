import pandas as pd
import numpy as np


def get_reading_stats(books_read):
    if not books_read:
        return{
            'months':['Jan' , 'Feb' , 'Mar' , 'Apr'] ,
            'booksRead' : [0 , 0 , 0 , 0]
        }
    
    df = pd.DataFrame(books_read)
    df['data_added'] = pd.to_datetime(df['date_added'])
    df.set_index('date_added' , inplace=True)

    monthly_counts = df.resample('M').size()

    return {
        'months' : monthly_counts.index.strftime('%b').tolist(),
        'booksRead':monthly_counts.tolist()
    }