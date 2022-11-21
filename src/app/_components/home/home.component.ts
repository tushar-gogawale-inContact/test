import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public title: string = 'Angular 7';
  tableData;
  fileUpload = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  openOptions() {
  	window.document.getElementById('dashboard-button').click();
  }

  public uploadData(e) {
    console.log(e.target.files[0]);
    const target: DataTransfer = <DataTransfer>(<unknown>event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    this.fileUpload = true;
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      console.log(binarystr);
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.tableData = binarystr;
      this.sendFiledata();
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      this.tableData = data;
    };
  }

  postData(data) {
    const headerDict = {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization': 'None'
    };
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.put('https://abhishek12102-bucket1.s3.ap-south-1.amazonaws.com/test2.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20221121T092729Z&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Expires=14400&X-Amz-Credential=AKIAQRVTNUSK2MCW5Y3F%2F20221121%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=82ea9ccf46dacae35816d02e054e93f912b5ee6c9f47ecd15756875cebed52b3', data, requestOptions);
  }

  sendFiledata() {
    this.postData(this.tableData).subscribe(res => {
      console.log(res);
      this.fileUpload = false;
    }, (error) => {
      console.log(error);
      this.fileUpload = false;
    });
  }
}
