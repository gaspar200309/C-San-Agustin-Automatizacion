import pandas as pd
from datetime import datetime

def normalize_and_insert(file_path, output_file_path):
    # Load the Excel file, skipping the first two rows
    df = pd.read_excel(file_path, skiprows=2)
    
    # Rename columns manually based on the structure observed
    df.columns = [
        'Objetivo_SGC', 'Unknown1', 'Descripcion_Objetivo',
        'Optimo', 'Clasificacion', 'Objetivo_Administrativo',
        'Unknown2', 'Unknown3', 'Unknown4', 'Unknown5',
        'Unknown6', 'Unknown7', 'Unknown8', 'Unknown9',
        'Unknown10', 'Unknown11', 'Unknown12', 'Unknown13',
        'Unknown14', 'Unknown15', 'Unknown16', 'Unknown17',
        'Unknown18', 'Unknown19', 'Unknown20', 'Unknown21',
        'Diciembre'
    ]
    
    # Filter the DataFrame to keep only relevant columns
    df_filtered = df[['Objetivo_SGC', 'Descripcion_Objetivo', 'Optimo', 'Clasificacion', 'Objetivo_Administrativo']]
    
    # Drop rows with all NaN values in the filtered DataFrame
    df_filtered.dropna(how='all', inplace=True)
    
    # Prepare a list to collect normalized data
    normalized_data = []

    for _, row in df_filtered.iterrows():
        # Normalize data
        objacademico = {
            'OBJETIVOS ACADÉMICOS': row['Objetivo_SGC'],
            'Descripcion Objetivo': row['Descripcion_Objetivo']
        }

        osgc = {
            'Nombre OSGC': row['Optimo'],
            'Descripcion OSGC': row['Clasificacion']
        }

        lineabase = {
            'Tipo de Linea Base': row['Objetivo_Administrativo']
        }

        indicador = {
            'Nombre Obj Academico': row['Objetivo_SGC'],
            'Nombre OSGC': row['Optimo'],
            'Tipo de Linea Base': row['Objetivo_Administrativo'],
            'Nombre Indicador': row['Clasificacion']
        }

        # Collect normalized data
        normalized_data.append({**objacademico, **osgc, **lineabase, **indicador})

    # Convert normalized data to DataFrame
    normalized_df = pd.DataFrame(normalized_data)

    # Save the normalized data to a new Excel file
    normalized_df.to_excel(output_file_path, index=False)
    print(f'Normalized data saved to {output_file_path}')
