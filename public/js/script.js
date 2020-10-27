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

    document.getElementById('data-total').innerHTML = numberWithCommas(dt_total);
    document.getElementById('data-total-tambah').innerHTML = '+'+dt_tambah_positif;
    document.getElementById('data-rawat').innerHTML = numberWithCommas(dt_rawat);
    document.getElementById('data-rawat-tambah').innerHTML = '+'+dt_tambah_rawat;
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
    // console.log(data);
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
      // console.log(index);
    });

    document.getElementById('bodyTable').innerHTML = tbody;
    document.getElementById('dropCC').innerHTML = dropCC;
    // limitCC();

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
  var input, filter, row, card, nama_rs, i, txtValue;
  input = document.getElementById("myInput-RS"+j);
  filter = input.textContent;
  row = document.getElementById("row-card-RS");
  card = row.getElementsByClassName('card-RS');

  for (i = 0; i < card.length; i++) { 
    let nama_rs = card[i].getElementsByTagName('h5')[0].innerHTML;
    if (nama_rs) {
        // txtValue = td.textContent || td.innerText;
        if (nama_rs == filter) {
            card[i].style.display = "";
        } else {
            card[i].style.display = "none";
        }
    }
  }
}

function limitRS() {
  let row, tr, i;
  row = document.getElementById("row-card-RS");
  tr = row.getElementsByClassName('card-RS');

  for (i = 3; i < tr.length; i++) {
      tr[i].style.display = "none";
  }
}


















// hideSlick();
// hideSlickThumb();
function hideSlick(){
    document.getElementById('slick-next').style.display = 'none';
    document.getElementById('slick-prev').style.display = 'none';
}
function showSlick(){
    document.getElementById('slick-next').style.display = 'block';
    document.getElementById('slick-prev').style.display = 'block';
}
function hideSlickThumb(){            
    let slick = document.getElementsByClassName('thumbnail-carousel');
    let tag = slick[0].children;
    tag[0].style.display = "none";
    tag[2].style.display = "none";
}        
function showSlickThumb(){
    let slick = document.getElementsByClassName('thumbnail-carousel');
    let tag = slick[0].children;
    tag[0].style.display = "block";
    tag[2].style.display = "block";
}

baguetteBox.run('#thumb');
baguetteBox.run('#slick');

$(document).ready(function(){
    $('.fade-carousel').slick({
        autoplay: true,
        autoplaySpeed: 5000
    });
});

$(document).ready(function(){
    $('.thumbnail-carousel').slick({
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true,
        lazyLoad: 'ondemand',
        // slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
        // adaptiveHeight: true
    });
});