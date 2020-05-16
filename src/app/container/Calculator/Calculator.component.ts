import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
@Component({
    selector: 'calculator-app',
    templateUrl: './Calculator.component.html',
    styleUrls: ['./Calculator.component.css']
})
export class CalculatorComponent implements OnInit {
    
    @ViewChild('calulator') calulator: ElementRef;
    calc: string;
    buttons: string[] = ['7', '8','9','/','4','5','6','x','1','2','3','-','0','.','=','+'];
    actionTypes: string[] = ['/', 'x', '-','+','='];
    inputArr: string[] = [];
    inputHolder: any;
    lastElemIndex: number;
    result: string;
    ngOnInit(){
    this.calc = this.inputArr.join();
   }
   keyHandler(key: string = '0'){
      if(this.inputArr.length == 0 && this.actionTypes.indexOf(key) !== -1){
         return;
       }

      if(this.actionTypes.indexOf(this.inputArr[this.inputArr.length-1]) == -1 ){
        this.inputArr.push(key);
      }else{
          if(this.actionTypes.indexOf(key) == -1){
            this.inputArr.push(key);
          }
       }
      this.calc = this.inputArr.join('');
      this.calulator.nativeElement.style.color = "white";
      if(key == '='){
          this.inputHolder = [...this.inputArr];
          if(this.inputHolder.indexOf('=')!== -1){
            if(this.actionTypes.indexOf(this.inputHolder[this.inputHolder.length-1]) !== -1){
              this.arithOps([...this.inputArr]);
              return;
            }
          }else{
            if(this.actionTypes.indexOf(this.inputHolder[this.inputHolder.length]) !== -1){
              this.arithOps([...this.inputArr]);
              return;
            }
          }
           
         
          return;
      }
   }
   arithOps(input){
    let temp = [...input];  
    let finalOutput =[]; 
    if(temp .length <= 2){
        this.calc =`${ this.inputHolder.join('')} ${temp[0]}`;
        console.log('PRINT OP',this.calc)
        //let print = this.calc.includes('=')? return this.calc[0]:  retun this.calc;
        return;
    }
    let previous = []
    let tempInput = [...temp.splice(0, temp.length-1)];
    if(tempInput.indexOf('/') !== -1){
        finalOutput  = this.helperCall(input,tempInput,'/')
        previous = [...finalOutput];
        this.arithOps(finalOutput);
     }
     if(tempInput.indexOf('x') !== -1){
         finalOutput = this.helperCall(input,tempInput,'x')
         previous =  [...finalOutput];
        this.arithOps(finalOutput);
     }
     if(tempInput.indexOf('+') !== -1){
         finalOutput = this.helperCall(input,tempInput,'+')
         previous =  [...finalOutput];
        this.arithOps(finalOutput);
     }
     if(tempInput.indexOf('-') !== -1){
         finalOutput =this.helperCall(input,tempInput,'-')
         previous = [...finalOutput];
        this.arithOps(finalOutput);
        
     }
   }
   helperCall(input,tempInput,opr){
    let index = tempInput.indexOf(opr);
    const resultantArr = this.calculate(input,tempInput,index,opr)
    return resultantArr;
   }
   calculate(input, tempInput, index , operator){
    let leftElm = this.getLeftOperand([...tempInput.splice(0, index)]);
    let rightElm = this.getRightOperand([...tempInput.splice(1, tempInput.length)]);
    const resultantArr = [...input];
    let count = 0;
    let ans = '';
    // update input
    if(typeof leftElm == 'string'){
      count = leftElm.length + (rightElm.includes('.')? rightElm.length -2: rightElm.length);
      switch(operator){
         case '/': ans = ((+leftElm) / (+rightElm)).toFixed(1); break;
         case 'x': ans = ((+leftElm) * (+rightElm)).toString(); break;
         case '+': ans = ((+leftElm) + (+rightElm)).toString(); break;
         case '-': ans = ((+leftElm) - (+rightElm)).toString(); break;
         default: return;
      }
      input  = [...input, ans];
      resultantArr.splice(0,count+1,ans);
    }else{
        count = leftElm['left'].length + (rightElm.includes('.')? rightElm.length -2: rightElm.length);
        switch(operator){
            case '/': ans = ((+leftElm['left']) / (+rightElm)).toFixed(1); break;
            case 'x': ans = ((+leftElm['left']) * (+rightElm)).toString(); break;
            case '+': if(leftElm['op'] == '-'){
                         if((+leftElm['left']) > (+rightElm)){
                            ans = ((+leftElm['left']) - (+rightElm)).toString();
                         }
                         else if((+leftElm['left']) < (+rightElm)){
                            ans = ((+rightElm)-(+leftElm['left'])).toString();
                            leftElm['op'] = '+';
                         }
                         else{
                            ans = ((+leftElm['left']) - (+rightElm)).toString();
                         }
                           
                      }
                      else{
                        ans = ((+leftElm['left']) + (+rightElm)).toString();
                      } 
                      break;
            case '-': if(leftElm['left'] == ''){
                        console.log("left one: ", (+leftElm['left']))
                      }else if(leftElm['left'].includes('-')){
                        console.log("left one: ", (+leftElm['left']))
                       // ans = ((+leftElm['left']) + (+rightElm)).toString();
                      }else{
                        ans = ((+leftElm['left']) - (+rightElm)).toString();
                      }
                       break;
            default: return;
         }
        
        input  = [...input, ans];
        let check = [];
        ans.includes('-')?check.push(ans):check.push(leftElm['op'],ans);
        
        resultantArr.splice(leftElm['indx'],count+2,...check);
    }
    return resultantArr;
   }
   getLeftOperand(arr){
    const leftOpArr = [];
    for(let i = arr.length -1; i >=0; i--){
        if(this.actionTypes.indexOf(arr[i]) !== -1){
           return {left: leftOpArr.reverse().join(''), indx: i, op: arr[i]}
        }else{
            leftOpArr.push(arr[i])
        }
    }
    return leftOpArr.reverse().join('');
   }
   getRightOperand(arr){
    const rightOpArr = [];
    for(let i = 0; i < arr.length -1; i++){
        if(this.actionTypes.indexOf(arr[i]) !== -1){
           return rightOpArr.join('');
        }else{
            rightOpArr.push(arr[i])
        }
    }
    return arr.join('');
   }
   edit(){
     this.inputArr.length > 0 ?this.inputArr.pop(): '';
     this.calc = this.inputArr.join('');
   }
}