import { Query } from "@/hooks/useData";
import XLSX from 'sheetjs-style';
import FileSaver from 'file-saver';
type Export = {
    query: Query,
    name: string
}
async function ExportTable ({query:{page, search, search_by, sort_by, sort_order}, name}: Export ) {
    const fetcher = await fetch(`/api/admin/export-table?page=${page}&sort_by=${sort_by}&sort_order=${sort_order}&search_by=${search_by}&search=${search}`);
    const result = await fetcher.json();
    if(!fetcher.ok) {
        return {status: fetcher.ok, message: result.message};
    }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(result.data);
    const wb = {Sheets: {'data' : ws}, SheetNames: ['data']};
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, (name||'TablaExportada')+fileExtension);
    return {status: fetcher.ok, message: result.message};
}

export default ExportTable