import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        database='postgres',
        user='postgres',
        password='8520'
    )
    conn.set_client_encoding('UTF8') 
    return conn