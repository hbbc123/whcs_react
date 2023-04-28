import ExportJsonExcel from 'js-export-excel';
export const  downLoadExcelMode = (fileName,sheetData,sheetFilter,sheetHeader,sheetName="sheet") =>{
    var option={};
    option.fileName = fileName
    option.datas=[{
         sheetData:sheetData,
         sheetName:sheetName,
         sheetFilter:sheetFilter,
         sheetHeader:sheetHeader,
         columnWidths: ['8','4'],
        },
    ];
    const ExportJsonExcel = require("js-export-excel");
    var toExcel=new ExportJsonExcel(option);
    toExcel.saveExcel();
  }
