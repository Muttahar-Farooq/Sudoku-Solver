const sudokuBodyElement = document.getElementById('sudoku-body');
const submitButton = document.getElementById('submit-btn');
const resetButton = document.getElementById('reset-btn');
const loaderCircle = document.getElementById('loader');

submitButton.addEventListener('click', ()=>{
    submitButton.classList.add('hide');
    resetButton.classList.add('hide');
    loaderCircle.classList.remove('hide');
    solveSudokuApi(submissionStringFormer());
})
resetButton.addEventListener('click', ()=>{
    cellElements.forEach((element)=>{
        element.value = '';
        element.classList.remove('outofrange-cell');
    });
    submitButton.classList.remove('hide');
})


for(i=0; i<81; i++){
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'number');
    inputElement.setAttribute('min', 1);
    inputElement.setAttribute('max', 9);
    inputElement.classList.add('cell');
    if ((i+1)%3 == 0 && (i+1)%9 != 0){
        inputElement.classList.add('right-border'); 
    }
    if ( (i+1>27 && i+1<=36) || (i+1>54 && i+1<=63) ){
        inputElement.classList.add('top-border'); 
    }
    sudokuBodyElement.appendChild(inputElement);
}

const cellElements = document.querySelectorAll('.cell');

function submissionStringFormer(){
    var submissionString = '';
    var inRange = true;  
    cellElements.forEach((element, index)=>{
        if (element.value === ''){
            submissionString += '.';
        }
        else if (element.value <= 9 && element.value >= 1){
            submissionString += element.value 
        } else{
            alert('Out of range value in ' + index + 'th cell');
            element.classList.add('outofrange-cell');
            inRange = false;
            return;
        }
        element.classList.remove('outofrange-cell');
    })
    if(inRange){return submissionString;}
    return '-1'; 
}

function outputSetter(recievedString){
    cellElements.forEach((element, index)=>{
        element.value = recievedString.charAt(index);
    })
}

function solveSudokuApi(submissionString){
    var options = {
        method: 'POST',
        url: 'https://solve-sudoku.p.rapidapi.com/',
        headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'solve-sudoku.p.rapidapi.com',
        'x-rapidapi-key': '7d3c1895e1mshf493669153577fdp1acc52jsn3a75733941c7'
        },
        data: {
            puzzle: submissionString 
        // puzzle: '2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3'
        }
    };
    
    if (submissionString === '-1'){
        loaderCircle.classList.add('hide');
        submitButton.classList.remove('hide');
        resetButton.classList.remove('hide');
    } else{
        axios.request(options).then(function (response) {
            console.log(response.data);
            if (response.data.solvable){outputSetter(
                response.data.solution);
                resetButton.classList.remove('hide');
            }
            else{
                alert('Pattern cannot be solved! :\'(');
                submitButton.classList.remove('hide');
                resetButton.classList.remove('hide');
            }
            loaderCircle.classList.add('hide');
            
        }).catch(function (error) {
            alert('Unable to communicate with the server!')
            loaderCircle.classList.add('hide');
            submitButton.classList.remove('hide');
            resetButton.classList.remove('hide');
        });
    }
}