   let input = document.getElementById("input")
   function addelement(value){
      input.value += value
   }

   //clear button function
   function clearbutton(){
    input.value = " "
   }

   //delete button function
   function deletebutton(){
    input.value = input.value.slice(0,-1)
   }

   //equal button function
   function equalbutton(){
    input.value = eval(input.value)
   }