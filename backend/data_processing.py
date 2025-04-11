import pandas as pd

def get_reading_stats(books_read):
    if not books_read:
        return {
            'years' : ['2024'],
            'months': ['Jan', 'Feb', 'Mar', 'Apr'],
            'booksRead': [2, 4, 1, 0],
            'average_rating': 3.5,
            'average_reading_speed': 0.8,
        }

    df = pd.DataFrame(books_read)

    df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')
    df['end_date'] = pd.to_datetime(df['end_date'], errors='coerce')
    df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
    print(df[['title', 'start_date', 'end_date', 'rating']])


    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')  
    df['rating'] = df['rating'].fillna(0)  


    # calculation for days to finish
    df['days_to_finish'] = (pd.to_datetime(df['end_date']) - pd.to_datetime(df['start_date'])).dt.days

    # unique years from data
    years = df['date_added'].dt.year.dropna().unique().tolist()

    results =  {
        'years' : [],
        'months' : [],
        'booksRead':[] ,
        'average_rating': [],
        'average_reading_speed': [] ,
     }  
    


    for year in years :
        #filter for current year
        df_year = df[df['date_added'].dt.year == year].copy()
         
        #monthly stats
        df_year['month'] = df_year['date_added'].dt.strftime('%B')
        months = pd.date_range(start=f'1/1/{year}' , end = f'12/31/{year}' , freq = 'ME').strftime('%B').tolist()
        books_read_per_month = df_year.groupby('month').size().reindex(months ,fill_value=0).tolist()

        # yearly stats
        average_rating = df_year['rating'].mean()
        average_reading_speed = df_year['days_to_finish'].mean()

        results['years'].append(year)
        results['months'].append(months)
        results['booksRead'].append(books_read_per_month)
        results['average_rating'].append(average_rating)
        results['average_reading_speed'].append(average_reading_speed)


    return results