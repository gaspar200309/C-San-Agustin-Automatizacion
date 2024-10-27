import React from 'react';
import { useParams } from 'react-router-dom';
import Indicator1 from '../forms/Indicator1';
import Indicator2 from '../forms/Indicator2';
import Indicator3 from '../forms/Indicator3';
import Indicator4 from '../forms/Indicator4';
import Indicator6 from '../forms/Indicator6';
import Indicator7 from '../forms/Indicator7';
import Indicator8 from '../forms/Indicator8';
import Indicator10 from '../forms/Indicator10';
import Indicator11 from '../forms/Indicator11';
import Indicator12 from '../forms/Indicator12';
import Indicator13 from '../forms/Indicator13';
import CourseDataForm from '../forms/NuevosInd/CourseDataForm';
import YearlyCommunicationsForm from '../forms/NuevosInd/YearlyCommunicationsForm';
import TeacherNotesForm from '../forms/NuevosInd/TeacherNotesForm';


const indicatorComponents = {
  1: Indicator1,
  2: Indicator2,
  3: Indicator3,
  4: Indicator4,
  6: Indicator6,
  7: Indicator7,
  8:  Indicator7,/* Esto por que esta repitiendo en la base de datos  */
  9: Indicator8,
  10: Indicator10,
  11: Indicator11,
  12: Indicator12,
  13: Indicator13,
  14: CourseDataForm,
  5: YearlyCommunicationsForm,
  17: TeacherNotesForm
};

const DynamicIndicator = () => {
  const { id } = useParams();
  const IndicatorComponent = indicatorComponents[id];

  if (!IndicatorComponent) {
    return <div>Indicator not found</div>;
  }

  return <IndicatorComponent />;
};

export default DynamicIndicator;