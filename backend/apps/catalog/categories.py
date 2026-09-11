CATEGORY_DATA = [
    # Ana kategoriler
    {
        "name": "Taşıtlar",
        "slug": "tasitlar",
        "parent_slug": None,
    },
    
   {
        "name": "Motosiklet",
        "slug": "motosiklet",
        "parent_slug": "tasitlar",
    },

    {
            "name": "Scooter",
            "slug": "scooter",
            "parent_slug": "tasitlar",
    },

    {
        "name": "Elektrikli",
        "slug": "elektrikli",
        "parent_slug": "tasitlar",
    },
    {
        "name": "ATV / UTV",
        "slug": "atv-utv",
        "parent_slug": "tasitlar",
    },
    {
        "name": "Bisiklet",
        "slug": "bisiklet",
        "parent_slug": "tasitlar",
    },

#taşıtlar dışındakiler
   
    {
        "name": "Yedek Parça",
        "slug": "yedek-parca",
        "parent_slug": None,
    },

    {
        "name": "Aksesuar",
        "slug": "aksesuar",
        "parent_slug": None,
    },

    {
        "name": "Bakim ve Temizlik",
        "slug": "bakim-ve-temizlik",
        "parent_slug": None,
    },

  

{
        "name": "Ekipman",
        "slug": "ekipman",
        "parent_slug": None,
    },

    # Motosiklet alt kategorileri
  
    {
        "name": "Naked",
        "slug": "naked",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Enduro",
        "slug": "enduro",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Adventure",
        "slug": "adventure",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Touring",
        "slug": "touring",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Sport",
        "slug": "sport",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Chopper",
        "slug": "chopper",
        "parent_slug": "motosiklet",
    },
    {
        "name": "Cross",
        "slug": "cross",
        "parent_slug": "motosiklet",
    },

    # Elektrikli alt kategorileri
    {
        "name": "Elektrikli Motosiklet",
        "slug": "elektrikli-motosiklet",
        "parent_slug": "elektrikli",
    },
    {
        "name": "E-Scooter",
        "slug": "e-scooter",
        "parent_slug": "elektrikli",
    },
    {
        "name": "E-Bisiklet",
        "slug": "e-bisiklet",
        "parent_slug": "elektrikli",
    },
    {
        "name": "E-Car",
        "slug": "e-car",
        "parent_slug": "elektrikli",
    },
    {
        "name": "E-Kasalı",
        "slug": "e-kasali",
        "parent_slug": "elektrikli",
    },

    { "name": "E-Market Tipi", 
     "slug": "e-market-tipi", 
     "parent_slug": "elektrikli" },


    #yedek parca alt kategorileri
    {
        "name": "Ayna",
        "slug": "ayna",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Granaj",
        "slug": "granaj",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Fren Sistemi",
        "slug": "fren-sistemi",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Motor Parçaları",
        "slug": "motor-parcalari",
        "parent_slug": "yedek-parca",
    },

     {
        "name": "Buji",
        "slug": "buji",
        "parent_slug": "motor-parcalari",
    },

    {
        "name": "Elektrik Sistemi",
        "slug": "elektrik-sistemi",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Süspansiyon Sistemi",
        "slug": "suspansiyon-sistemi",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Egzoz Sistemi",
        "slug": "egzoz-sistemi",
        "parent_slug": "yedek-parca",
    },

     {
        "name": "Akü",
        "slug": "aku",
        "parent_slug": "yedek-parca",
    },


     {
        "name": "Lastik",
        "slug": "lastik",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Ön Lastik",
        "slug": "on-lastik",
        "parent_slug": "lastik",
    },
    {
        "name": "Arka Lastik",
        "slug": "arka-lastik",
        "parent_slug": "lastik",
    },

       
    {
        "name": "Kaporta / Plastik Aksam",
        "slug": "kaporta-plastik-aksam",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Sele",
        "slug": "sele",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Gidon ve Gaz Kolu",
        "slug": "gidon-ve-gaz-kolu",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Zincir ve Dişli",
        "slug": "zincir-ve-disli",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Debriyaj Parçaları",
        "slug": "debriyaj-parcalari",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Hava Filtresi",
        "slug": "hava-filtresi",
        "parent_slug": "yedek-parca",
    },
    {
        "name": "Kasa Koruma / Düşme Demiri",
        "slug": "kasa-koruma-dusme-demiri",
        "parent_slug": "yedek-parca",
    },

    #bakim ve temizlik alt kategorileri
    {
        "name": "Temizlik Ürünleri",
        "slug": "temizlik-urunleri",
        "parent_slug": "bakim-ve-temizlik",
    },
    {
        "name": "Bakım Ürünleri",
        "slug": "bakim-urunleri",
        "parent_slug": "bakim-ve-temizlik",
    },

    {
        "name": "Motor Yağı",
        "slug": "motor-yagi",
        "parent_slug": "bakim-urunleri",
    },
    {
            "name": "Zincir Yağı",
            "slug": "zincir-yagi",
            "parent_slug": "bakim-urunleri",
    },



    {
            "name": "Şanzıman Yağı",
            "slug": "sanziman-yagi",
            "parent_slug": "bakim-urunleri",
    },
    {
            "name": "2T Yağı",
            "slug": "2t-yagi",
            "parent_slug": "bakim-urunleri",
    },
    {
            "name": "Fork Yağı",
            "slug": "fork-yagi",
            "parent_slug": "bakim-urunleri",
    },
    {
            "name": "Fren Hidroliği",
            "slug": "fren-hidroligi",
            "parent_slug": "bakim-urunleri",
    },
    {
            "name": "Soğutma Sıvısı",
            "slug": "sogutma-sivisi",
            "parent_slug": "bakim-urunleri",
    },

            #ekipman alt kategorileri

    #ekipman alt kategorileri

    {
        "name": "Koruma Ekipmanı",
        "slug": "koruma-ekipmani",
        "parent_slug": "ekipman",
    },

    {
    "name": "Sırt Koruyucu",
    "slug": "sirt-koruyucu",
    "parent_slug": "koruma-ekipmani",
},



{
    "name": "Göğüs Koruyucu",
    "slug": "gogus-koruyucu",
    "parent_slug": "koruma-ekipmani",
},
{
    "name": "Dirseklik",
    "slug": "dirseklik",
    "parent_slug": "koruma-ekipmani",
},
{
    "name": "Boyun Koruyucu",
    "slug": "boyun-koruyucu",
    "parent_slug": "koruma-ekipmani",
},
{
    "name": "Zırhlı Gömlek / Yelek",
    "slug": "zirhli-gomlek-yelek",
    "parent_slug": "koruma-ekipmani",
},

{
    "name": "Yedek Zırh",
    "slug": "yedek-zirh",
    "parent_slug": "koruma-ekipmani",
},

 {
        "name": "Dizlik",
        "slug": "dizlik",
        "parent_slug": "koruma-ekipmani",
    },

            {
                "name": "Motosiklet Montu",
                "slug": "motosiklet-montu",
                "parent_slug": "ekipman",
            },

            {
                    "name": "Motosiklet Pantolonu",
                    "slug": "motosiklet-pantolonu",
                    "parent_slug": "ekipman",
                },
            {
                    "name": "Motosiklet Eldiveni",
                    "slug": "motosiklet-eldiveni",
                    "parent_slug": "ekipman",
                },


                         
                    {
                            "name": "Bot",
                            "slug": "motosiklet-botu",
                            "parent_slug": "ekipman",
                        },
                    {
                            "name": "Yağmurluk",
                            "slug": "yagmurluk",
                            "parent_slug": "ekipman",
                        },
                    

                        {
                                "name": "Kask",
                                "slug": "kask",
                                "parent_slug": "ekipman",
                            },

                            
                    



            #aksesuar alt kategorileri
            {
                "name": "Bisiklet Aksesuarları",
                "slug": "bisiklet-aksesuarlari",
                "parent_slug": "aksesuar",
            },
            {
                    "name": "Motosiklet Aksesuarları",
                    "slug": "motosiklet-aksesuarlari",
                    "parent_slug": "aksesuar",
                },
                {
                        "name": "Elektrikli Aksesuarları",
                        "slug": "elektrikli-aksesuarlari",
                        "parent_slug": "aksesuar",
                    },


                    {
                "name": "Çanta ve Bagaj Sistemleri",
                "slug": "canta-ve-bagaj-sistemleri",
                "parent_slug": "aksesuar",
            },
            {
                "name": "Ön Cam / Rüzgarlık",
                "slug": "on-cam-ruzgarlik",
                "parent_slug": "aksesuar",
            },
            {
                "name": "Kilit ve Güvenlik",
                "slug": "kilit-ve-guvenlik",
                "parent_slug": "aksesuar",
            },
            {
                "name": "Intercom / Bluetooth İletişim",
                "slug": "intercom-bluetooth-iletisim",
                "parent_slug": "aksesuar",
            },
            {
                "name": "Sele Kılıfı ve Örtü",
                "slug": "sele-kilifi-ve-ortu",
                "parent_slug": "aksesuar",
            },
            {
                "name": "Kamera ve Navigasyon",
                "slug": "kamera-ve-navigasyon",
                "parent_slug": "aksesuar",
            },



                              # Bisiklet alt kategorileri


    {
        "name": "Dağ Bisikleti",
        "slug": "dag-bisikleti",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Yol Bisikleti",
        "slug": "yol-bisikleti",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Şehir Bisikleti",
        "slug": "sehir-bisikleti",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Çocuk Bisikleti",
        "slug": "cocuk-bisikleti",
        "parent_slug": "bisiklet",   
    },

     {
        "name": "4 Çeker",
        "slug": "4-ceker",
        "parent_slug": "atv-utv",
    },

     {
        "name": "2 Çeker",
        "slug": "2-ceker",
        "parent_slug": "atv-utv",
    },


    # Scooter alt kategorileri
    {
        "name": "50cc Scooter",
        "slug": "50cc-scooter",
        "parent_slug": "scooter",
    },
    {
        "name": "125cc Scooter",
        "slug": "125cc-scooter",
        "parent_slug": "scooter",
    },
    {
        "name": "150-250cc arası Scooter",
        "slug": "150-250cc-arasi-scooter",
        "parent_slug": "scooter",
    },
    {
        "name": "Maxi Scooter (250cc)",
        "slug": "maxi-scooter-250cc",
        "parent_slug": "scooter",
    },
    {
        "name": "Maxi Scooter (250cc Üzeri)",
        "slug": "maxi-scooter-250cc-uzeri",
        "parent_slug": "scooter",
    },

    # Bisiklet ek alt kategorileri
    {
        "name": "BMX",
        "slug": "bmx",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Katlanır Bisiklet",
        "slug": "katlanir-bisiklet",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Gravel Bisikleti",
        "slug": "gravel-bisikleti",
        "parent_slug": "bisiklet",
    },
    {
        "name": "Tur / Trekking Bisikleti",
        "slug": "tur-trekking-bisikleti",
        "parent_slug": "bisiklet",
    },
]