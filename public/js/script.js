async function getDataPasien() {
  try{
    const getAPI = await fetch("/api");
    const result = await getAPI.json();
    const data = result.list_data;

    let tgl = result.last_date.split("-");
    tgl[1] = changeToStr(tgl[1]);
    const lastUpdate = tgl.reverse().join(" ");
    document.getElementById('last-update').innerHTML = lastUpdate;

    let getSumut = data.filter((val) => {
      return val.key == "SUMATERA UTARA";
    });

    const dt_total = getSumut[0].jumlah_kasus;
    const dt_rawat = getSumut[0].jumlah_dirawat;
    const dt_sembuh = getSumut[0].jumlah_sembuh;
    const dt_meninggal = getSumut[0].jumlah_meninggal;
    const dt_tambah_positif = getSumut[0].penambahan.positif;
    const dt_tambah_sembuh = getSumut[0].penambahan.sembuh;
    const dt_tambah_meninggal = getSumut[0].penambahan.meninggal;

    const getAPIlocal = await fetch("/api/statistik");
    const dataLocal = await getAPIlocal.json();
    const last = dataLocal.length - 1;
    const last2 = dataLocal.length - 2;
    const dt_tambah_rawat = dataLocal[last].jumlah_dirawat - dataLocal[last2].jumlah_dirawat;

    let tanda = dt_tambah_rawat > 0 ? "+" : "";

    document.getElementById('data-total').innerHTML = numberWithCommas(dt_total);
    document.getElementById('data-total-tambah').innerHTML = '+'+dt_tambah_positif;
    document.getElementById('data-rawat').innerHTML = numberWithCommas(dt_rawat);
    document.getElementById('data-rawat-tambah').innerHTML = tanda+dt_tambah_rawat;
    document.getElementById('data-sembuh').innerHTML = numberWithCommas(dt_sembuh);
    document.getElementById('data-sembuh-tambah').innerHTML = '+'+dt_tambah_sembuh;
    document.getElementById('data-meninggal').innerHTML = numberWithCommas(dt_meninggal);
    document.getElementById('data-meninggal-tambah').innerHTML = '+' + dt_tambah_meninggal;
  }
  catch (e) {
    console.log("Error reading the todos.")
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}

const changeToStr = (x) => {
  switch (x) {
    case "1":
      text = "Jan";
      break;
    case "2":
      text = "Feb";
      break;
    case "3":
      text = "Mar";
      break;
    case "4":
      text = "Apr";
      break;
    case "5":
      text = "Mei";
      break;
    case "6":
      text = "Jun";
      break;
    case "7":
      text = "Jul";
      break;
    case "8":
      text = "Agu";
      break;
    case "9":
      text = "Sep";
      break;
    case "10":
      text = "Okt";
      break;
    case "11":
      text = "Nov";
      break;
    case "12":
      text = "Des";
      break;
    default:
      text = "No value found";
  }
  return text;
}

async function getDataCC(limit){
  try {
    const getAPI = await fetch("/api/local");
    const result = await getAPI.json();
    const data = result.call_center;
    let tbody = "";
    let dropCC = "";

    data.map((val, index) => {
      let j = index+1;
      let cc = "";
      let web = "";
      
      val.call_center.map((v) => {
        if (v == "-") {
          cc += ``;
        } else {
          cc += `<a href='tel:`+ v +`'><button class='btn'>`+ v +`</button></a>`;
        }
      });

      if (val.website == null) {
        web += ``;
      } else {
        web += `<a href='`+ val.website +`' target="_blank" rel="noopener noreferrer"><button class='btn'>Website</button></a>`;
      }

      tbody += "<tr><td>"+ j +"</td><td>"+ val.nama +"</td><td>"+ cc +"</td><td>"+ web +"</td></tr>";

      dropCC += "<p id='myInput"+j+"' class='dropdown-item' onclick='searchCC("+j+")'>"+ val.nama +"</p>";
    });

    document.getElementById('bodyTable').innerHTML = tbody;
    document.getElementById('dropCC').innerHTML = dropCC;
    iconSearch();

    if (limit) {limitCC()}

  } catch (error) {
    console.log("Error reading Kab Call Center API.")
  }
}

function limitCC() {
  let row = document.getElementById("bodyTable");
  let tr = row.getElementsByTagName('tr');
  
  for(let i = 3; i < tr.length; i++) {
    tr[i].style.display = "none";
  }
}

function searchCC(j) {
  var input, filter, table, tr, td, i, txtValue;
  
  // Show button 'Lihat Semua'
  let btnShowCC = document.getElementById('btn-show-cc');
  if (btnShowCC) {
    btnShowCC.style.display = "block";
  }

  input = document.getElementById("myInput"+j);
  filter = input.textContent;
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue == filter) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }       
  }
}

const showAllCC = () => {
  // Menampilkan semua card-CC
  let div = document.getElementById('bodyTable').querySelectorAll('tr');
  div.forEach((val) => {
    val.style.display = "";
  });

  // Hide button 'Lihat Semua'
  document.getElementById('btn-show-cc').style.display = "none";
}

async function getDataRS(limit) {
  try {
    const getAPI = await fetch("/api/local");
    const result = await getAPI.json();
    const data = result.rs_rujukan;
    let tbody = "";
    let dropRS = "";
  
    data.map((val, index) => {
      let j = index+1;
      let no_rs = ``;
  
      val.no_telp.map((v)=>{
        no_rs += `<a href='tel:`+ v +`'>
              <button class='btn mt-3'>`+ v +`</button></a>`;
      });
  
      tbody += `<div class='col-lg-4 col-md-6 card-RS'>
                  <div class='col-12'>
                    <div class='card-line'></div>
                    <div class='px-0'>
                      <h4>`+ val.nama +`</h4>
                      <span>`+ val.alamat +`</span>
                    </div>
                    <div class='px-0'>`+ no_rs +`</div>
                  </div>
                </div>`;
  
      dropRS += "<p id='myInput-RS"+j+"' class='dropdown-item' onclick='searchRS("+j+")'>"+ val.nama +"</p>";
    });
  
    document.getElementById('row-card-RS').innerHTML = tbody;
    document.getElementById('dropRS').innerHTML = dropRS;

    if (limit) {
      limitRS()
    }
    
  } catch (error) {
    console.log('Error reading RS API');
  }
}

function searchRS(j) {
  let input, filter, row, card, nama_rs, i, btnShow;
  input = document.getElementById("myInput-RS"+j);
  filter = input.textContent;
  row = document.getElementById("row-card-RS");
  card = row.getElementsByClassName('card-RS');

  // Show button 'Lihat Semua'
  let btnShowRS = document.getElementById('btn-show-rs');
  if (btnShowRS) {
    btnShowRS.style.display = "block";
  }

  for (i = 0; i < card.length; i++) { 
    nama_rs = card[i].getElementsByTagName('h4')[0].innerHTML;
    if (nama_rs) {
        if (nama_rs == filter) {
            card[i].style.display = "block";
        } else {
            card[i].style.display = "none";
        }
    }
  }
}

const showAllRS = () => {
  // Menampilkan semua card-RS
  let div = document.getElementById('row-card-RS').querySelectorAll('.card-RS');
  div.forEach((val) => {
    val.style.display = "block";
  });

  // Hide button 'Lihat Semua'
  document.getElementById('btn-show-rs').style.display = "none";
}

function limitRS() {
  let row, tr, i;
  row = document.getElementById("row-card-RS");
  tr = row.getElementsByClassName('card-RS');

  for (i = 3; i < tr.length; i++) {
      tr[i].style.display = "none";
  }
}

async function getFaq(){
  try {
    const getAPI = await fetch("/api/local")
    const result = await getAPI.json();
    const data = result.faq;
    let list_faq = '';

    data.forEach(list => {
        list_faq += `
        <div class="col-12 toggle-faq" data-toggle="collapse" data-target="#text-faq`+list.id+`">
            <div class="col-1 text-center">`+list.id+`.</div>
            <div class="col-sm-11 px-0">
              <div class="col-12 isi-faq">
                <div>
                    <span>`+list.pertanyaan+`</span>
                </div>
                <div class="col-icon-fa">
                  <i class="ri-arrow-down-s-line"></i>
                </div>
              </div>
              <div id="text-faq`+list.id+`" class="isi-text-faq collapse" data-parent="#accordion">
                  `+list.jawaban+`
              </div>
            </div>
        </div>`;
    });

    document.getElementById('accordion').innerHTML = list_faq;
    iconChange();

  } catch (e) {
      console.log("Error read API faq");
  }
}

function searchFAQ() {
  var input, filter, row, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  row = document.getElementById("accordion");
  tr = row.getElementsByClassName('toggle-faq');

  for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("span")[0];
      if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
  }
}

let iconSearch = () => {
  // Animate for arrow icon in FAQ page
  $(document).ready(function(){
    // Toggle plus minus icon on show hide of collapse element
    $(".dropdown").on('show.bs.dropdown', function () {
        $("i").removeClass("ri-arrow-down-s-line").addClass("ri-arrow-up-s-line");
    });
    $(".dropdown").on('hide.bs.dropdown', function () {
        $("i").removeClass("ri-arrow-up-s-line").addClass("ri-arrow-down-s-line");
    });
});
}

let iconChange = () => {
  // Animate for arrow icon in FAQ page
  $(document).ready(function(){
      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function(){
          $(this).prev(".isi-faq").find(".ri-arrow-down-s-line").removeClass("ri-arrow-down-s-line").addClass("ri-arrow-up-s-line");
      }).on('hide.bs.collapse', function(){
          $(this).prev(".isi-faq").find(".ri-arrow-up-s-line").removeClass("ri-arrow-up-s-line").addClass("ri-arrow-down-s-line");
      });
  });
}

let getDataChart = () => {
  let xData = [];
  let yData = [];

  for(var a=0; a<4; a++){
      getChart(a);
  }
  
  async function getChart(code){
    if (code == 0) {
        var ctx = document.getElementById('chart-konfirmasi');
    }
    else if (code == 1) {
        var ctx = document.getElementById('chart-rawat');
    }
    else if (code == 2) {
        var ctx = document.getElementById('chart-sembuh');
    }
    else{
        var ctx = document.getElementById('chart-meninggal');
    }

    await getChartValue(code);

    const listLabel = ['Terkonfirmasi', 'Dirawat', 'Sembuh', 'Meninggal'];

    const bgColor = ['rgba(66, 76, 164, .8)', 'rgba(236, 201, 75, .8)', 'rgba(56, 161, 105, .8)', 'rgba(229, 62, 62, .8)'];
    const borderColor = [];

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xData,
            datasets: [{
                label: listLabel[code],
                data: yData,
                backgroundColor: bgColor[code],
                borderColor: 'rgba(24, 78, 61, 1)',
                borderWidth: 1,
                fill: true,
                pointRadius: 6
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tanggal-Bulan'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

    xData = [];
    yData = [];
  }

  async function getChartValue(code) {
    try{
      const getAPI = await fetch("/api/statistik")
      const data = await getAPI.json();

      data.map((val) => {
        let tanggal = val.date.split("-").reverse();
        tanggal.pop();
        xData.push(tanggal.join("-"));

        if (code == 0) {
          yData.push(parseInt(val.jumlah_kasus));
        }
        else if (code == 1) {
          yData.push(parseInt(val.jumlah_dirawat));
        }
        else if (code == 2) {
          yData.push(parseInt(val.jumlah_sembuh));
        }
        else{
          yData.push(parseInt(val.jumlah_meninggal));
        }
      });
    }
    catch (e) {
      console.log("Error get value from Local API")
    }
  }
}





// Button Go to Top
var mybutton = document.getElementById("myBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  // Find max scroll length
  var limit = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
              document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
  let maxScrollHeight = limit - window.innerHeight - 200;

  if (document.body.scrollTop > maxScrollHeight || document.documentElement.scrollTop > maxScrollHeight) {
    if (window.innerWidth < 600) {
      mybutton.style.transform = 'translateY(-180px)';
    }
    else {
      mybutton.style.transform = 'translateY(-130px)';
    }
  }
  else if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    mybutton.style.transform = 'translateY(-100px)';
  } else {
      mybutton.style.transform = 'translateY(0px)';
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}















// Carousel on index's hero
function hideSlick(){
    document.getElementById('slick-next').style.display = 'none';
    document.getElementById('slick-prev').style.display = 'none';
}
function showSlick(){
    document.getElementById('slick-next').style.display = 'block';
    document.getElementById('slick-prev').style.display = 'block';
}

baguetteBox.run('#slick');

$(document).ready(function(){
    $('.fade-carousel').slick({
        autoplay: true,
        autoplaySpeed: 5000
    });
});