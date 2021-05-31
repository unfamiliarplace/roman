class App {

  constructor() {
    this.ORDER = 'IVXLCDM';
    this.SERIES = ['IVX', 'XLC', 'CDM', ['M', 'MMM', '']];
    this.FIVES = 'VLD';
    this.ONES = 'IXCM';
    this.LETTERS = {
      'I': 1,
      'V': 5,
      'X': 10,
      'L': 50,
      'C': 100,
      'D': 500,
      'M': 1000
    }
    this.SYSTEMS = {
      ARABIC: 'arabic',
      ROMAN: 'roman',
      INVALID: 'invalid',
      EMPTY: 'empty'
    }
    
    this.invalid = false;
    this.timeout = null;
  }

  convert(input) {
    this.invalid = false;
    
    if (!input) {
      // Empty input, empty output
      return '';

    } else if (this.isArabic(input)) {
      // Appears to be Arabic
      return this.arabicToRoman(input);

    } else if (this.isRoman(input)) {
      // Appears to be Roman
      return this.romanToArabic(input);

    } else {
      // Can't tell
      this.invalid = true;
      return 'Could not determine system';
    }
  }

  isArabic(s) {
    return !isNaN(parseInt(s)) && isFinite(s);
  }

  isRoman(s) {
    for (const c of s) {
      if (! this.ORDER.includes(c)) {
        return false;
      }
    }    
    return true;
  }

  arabicIsInRange(n) {
    return (n > 0) && (n < 5000);
  }

  arabicToRoman(input) {
    let arabic = parseInt(input);
    if (!this.arabicIsInRange(arabic)) {
      this.invalid = true;
      return 'Arabic out of range';
    }
    
    let roman = '';
    arabic = arabic.toString();
    
    let spelling = null;
    for (let i = 0; i < arabic.length; i++) {
      spelling = {
        '0': '',
        '1': this.SERIES[i][0],
        '2': this.SERIES[i][0].repeat(2),
        '3': this.SERIES[i][0].repeat(3),
        '4': this.SERIES[i][0] + this.SERIES[i][1],
        '5': this.SERIES[i][1],
        '6': this.SERIES[i][1] + this.SERIES[i][0],
        '7': this.SERIES[i][1] + this.SERIES[i][0].repeat(2),
        '8': this.SERIES[i][1] + this.SERIES[i][0].repeat(3),
        '9': this.SERIES[i][0] + this.SERIES[i][2]
      };

      roman = spelling[arabic[arabic.length - (i + 1)]] + roman;
    }
    return roman;
  }

  isValidRoman(groups) {
    const joined = groups.join('');
    for (let i = 0; i < this.ORDER.length; i++) {
      let no2uples = (this.ONES.indexOf(this.ORDER[i]) == -1 && joined.indexOf(this.ORDER[i].repeat(2)) != -1);
      let no5uples = (this.ONES.indexOf(this.ORDER[i]) != -1 && joined.indexOf(this.ORDER[i].repeat(5)) != -1);
      if (no2uples || no5uples) {
        return false;
      }
    }

    let i = 0;
    while (i < groups.length) {
      if (groups[i].length == 2) {

        if (this.FIVES.indexOf(groups[i][0]) != -1) {
          return false;
        }
        if (this.ORDER.indexOf(groups[i][0]) + 2 < this.ORDER.indexOf(groups[i][1])) {
          return false;
        }
        if (i > 0) {
          if (groups[i][0] == groups[i - 1][0]) {
            return false;
          }
          if (this.FIVES.indexOf(groups[i][1]) != -1 && groups[i - 1].indexOf(groups[i][1]) != -1) {
            return false;
          }
        }
      }

      if (i > 0) {
        if (groups[i - 1].length == 2) {
          if (this.ORDER.indexOf(groups[i][0]) >= this.ORDER.indexOf(groups[i - 1][0])) {
            return false;
          }
        }
      }

      i++
    }

    return true;
  }

  romanToGroups(roman) {
    let groups = [];

    let i = 0;
    while (i < roman.length) {

      if (i < roman.length - 1) {
        if (this.ORDER.indexOf(roman[i]) < this.ORDER.indexOf(roman[i + 1])) {
          groups.push(roman[i] + roman[i + 1]);
          i += 2;
        } else {
          groups.push(roman[i]);
          i++;
        }
      } else {
        groups.push(roman[i]);
        i++;
      }
    }
    return groups;
  }

  romanToArabic(input) {
    const groups = this.romanToGroups(input);
    if (!this.isValidRoman(groups)) {
      this.invalid = true;
      return 'Invalid Roman numeral';
    }

    let arabic = 0;

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length == 1) {
        arabic += this.LETTERS[groups[i][0]];
      } else {
        arabic += (this.LETTERS[groups[i][1]] - this.LETTERS[groups[i][0]]);
      }
    }

    return arabic;
  }
  
  bindInput() {
    $('#input').keyup(e => {
      const input = e.target.value.trim().toUpperCase();      
      const output = this.convert(input);
      
      if (! input) {
        this.disableButtons(true);
      } else {        
        this.disableButtons(false);
      }
      
      $('#outputText').val(output);
    });
  }
  
  bindCopy() {
    $('#btnCopy').click(e => {
      const text = $('#outputText');
      const content = text.val();
      text.focus();
      text.select();
      text[0].setSelectionRange(0, 9999);
      document.execCommand('copy');
      this.notify(`Copied '${content}'!`, 'rgba(25, 150, 40, 0.4)');
      $('#input').focus();
    });
  }
  
  bindClear() {
    $('#btnClear').click(e => {
      $('#input').val('');
      $('#outputText').val('');
      $('#input').focus();
      this.disableButtons(true);
      this.invalid = false;
      this.notify('Cleared!', 'rgba(150, 140, 50, 0.5)', 2000);
    });
  }
  
  bindSwap() {
    $('#btnSwap').click(e => {
      const currInput = $('#input').val();
      const currOutput = $('#outputText').val();
      $('#input').val(currOutput);
      $('#outputText').val(currInput.toUpperCase());
      $('#input').focus();
      this.disableButtons(false);
      this.notify('Swapped!', 'rgba(25, 75, 180, 0.45)', 2000);
    });
  }
  
  disableButtons(flag) {
    console.log(this.invalid);
    $('#btnClear').prop('disabled', flag);    
    $('#btnCopy').prop('disabled', flag || this.invalid);
    $('#btnSwap').prop('disabled', flag || this.invalid);
  }
  
  notify(text, colour, timeout) {
    
    if (! colour || typeof(colour) === 'undefined') {
      colour = 'rgba(255, 255, 255, 0.2)';
    }
    
    
    if (! timeout || typeof(timeout) === 'undefined') {
      timeout = 3000;
    }
    
    const notice = $('#notice');
    const noticeText = $('#noticeText');
    
    noticeText.html(text);
    noticeText.css('background-color', colour);
    noticeText.removeClass('hidden');
    
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      noticeText.html('');
      noticeText.css('background-color', 'none');
      noticeText.addClass('hidden');
    }, timeout);
    
  }
}

let app = null;

$(document).ready(e => {
  app = new App();
  app.bindInput();
  app.bindCopy();
  app.bindClear();
  app.bindSwap();
  $('#input').focus();
})
