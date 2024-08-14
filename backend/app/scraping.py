from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd

def scrape_data(email, password):
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)

    login_url = "https://centers.additioapp.com/access/login"
    data_url = "https://centers.additioapp.com/groupsbase/list"

    driver.get(login_url)

    username = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, 'email'))
    )
    password_field = driver.find_element(By.NAME, 'password')

    username.send_keys(email)
    password_field.send_keys(password)

    login_button = driver.find_element(By.XPATH, '//*[@type="submit"]')
    login_button.click()

    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.TAG_NAME, 'body'))
    )

    driver.get(data_url)

    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')

    dfs = []
    for table in tables:
        headers = [header.text for header in table.find_all('th')]
        rows = table.find_all('tr')
        table_data = []
        for row in rows:
            cells = row.find_all('td')
            row_data = [cell.text for cell in cells]
            table_data.append(row_data)
        df = pd.DataFrame(table_data, columns=headers)
        dfs.append(df)

    if dfs:
        result = pd.concat(dfs, ignore_index=True)
        result.to_excel('student_grades.xlsx', index=False)
        return {'message': 'Data scraped and saved successfully.'}
    else:
        return {'message': 'No data found.'}
