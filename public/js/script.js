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

async function getDataCC(){
  try {
    const getAPI = await fetch("/api/local")
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
        web += `<a href='`+ val.website +`' target='_blank'><button class='btn'>Website</button></a>`;
      }

      tbody += "<tr><td>"+ j +"</td><td>"+ val.nama +"</td><td>"+ cc +"</td><td>"+ web +"</td></tr>";

      dropCC += "<p id='myInput"+j+"' class='dropdown-item' onclick='searchCC("+j+")'>"+ val.nama +"</p>";
    });

    document.getElementById('bodyTable').innerHTML = tbody;
    document.getElementById('dropCC').innerHTML = dropCC;

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

async function getDataRS(){
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
                    <h5>`+ val.nama +`</h5>
                    <span>`+ val.alamat +`</span>
                  </div>
                  <div class='px-0'>`+ no_rs +`</div>
                </div>
              </div>`;

    dropRS += "<p id='myInput-RS"+j+"' class='dropdown-item' onclick='searchRS("+j+")'>"+ val.nama +"</p>";
  });

  // for (let i = 0; i < data.length; i++) {
  //     let j = i+1;
  //     let check = false;
  //     tbody += "<div class='col-lg-4 card-RS'><div class='col-12'><div class='card-line'></div><div class='px-0'><h5>"+ data[i].nama +"</h5><span>"+ data[i].alamat +"</span></div><div class='px-0'><a href='tel:"+ data[i].no_telp +"'><button class='btn mt-3'>"+ data[i].no_telp +"</button></a></div></div></div>";

  //     for (let k = 0; k < i; k++) {
  //         if (data[k].kabupaten == data[i].kabupaten) {
  //             check = true;
  //             break;
  //         }
  //     }

  //     if (check === false ) {
  //         dropRS += "<p id='myInput-RS"+j+"' class='dropdown-item' onclick='searchRS("+j+")'>"+ data[i].kabupaten +"</p>";   
  //     }
  // }

  document.getElementById('row-card-RS').innerHTML = tbody;
  document.getElementById('dropRS').innerHTML = dropRS;
}

function searchRS(j) {
  let input, filter, row, card, nama_rs, i, btnShow;
  input = document.getElementById("myInput-RS"+j);
  filter = input.textContent;
  row = document.getElementById("row-card-RS");
  card = row.getElementsByClassName('card-RS');

  // Show button 'Lihat Semua'
  document.getElementById('btn-show-rs').style.display = "block";

  for (i = 0; i < card.length; i++) { 
    nama_rs = card[i].getElementsByTagName('h5')[0].innerHTML;
    if (nama_rs) {
        if (nama_rs == filter) {
            card[i].style.display = "block";
        } else {
            card[i].style.display = "none";
        }
    }
  }
}

let showAllRS = () => {
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
        <div class="col-12 toogle-faq pl-0" data-toggle="collapse" data-target="#text-faq`+list.id+`">
            <div class="col-1 text-center">`+list.id+`.</div>
            <div class="col-11 pl-0">
                <div class="col-12 isi-faq px-0">
                    <div class="col-lg-12 col-md-11 px-0">
                        <span>`+list.pertanyaan+`</span>
                    </div>
                    <div class="col-1 col-icon-fa">
                        <i class="fa fa-chevron-down"></i>
                    </div>
                </div>
                <div id="text-faq`+list.id+`" class="isi-text-faq collapse" data-parent="#accordion">
                    `+list.jawaban+`
                </div>
            </div>
        </div>`;
    });

    document.getElementById('accordion').innerHTML = list_faq;

  } catch (e) {
      console.log("Error read API faq");
  }
}

function searchFAQ() {
  var input, filter, row, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  row = document.getElementById("accordion");
  tr = row.getElementsByClassName('toogle-faq');

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

let iconChange = () => {
  // Animate for arrow icon in FAQ page
  $(document).ready(function(){
      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function(){
          $(this).prev(".isi-faq").find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-up");
      }).on('hide.bs.collapse', function(){
          $(this).prev(".isi-faq").find(".fa").removeClass("fa-chevron-up").addClass("fa-chevron-down");
      });
  });
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