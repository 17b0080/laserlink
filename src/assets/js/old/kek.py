import urllib.request
import json


class Exchanger:
    # Начальные значения объекта
    from_currency = ''
    to_currency = ''
    amount = 0
    result = 0

    def __init__(self, a, b, n):
        # Конструктор класса, принимает параметры при создании экземпляра объекта
        self.from_currency = from_currency
        self.to_currency = to_currency
        self.amount = amount

    def getData(self):

        print('Введите индификаторы валют, которую переводите и в которую хотите перевести \n Список индификаторов валют: \n AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN,\n BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND,BOB,BRL,\n BSD,BTC,BTN,BWP,BYN,BZD,CAD,CDF,CHF,CLF,\n CLP,CNH,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,\n DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,\n GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,\n HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,\n JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,\n KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LYD,MAD,\n MDL,MGA,MKD,MMK,MNT,MOP,MRO,MRU,MUR,MVR,\n MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,\n OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,\n RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,\n SLL,SOS,SRD,SSP,STD,STN,SVC,SYP,SZL,THB,\n TJS, TMT, TND, TOP, TRY,TTD,TWD,TZS,UAH,UGX,\n USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,\n XAU,XCD,XDR,XOF,XPD,XPF,XPT,YER,ZAR,ZMW,ZWL')
        # <- обрати внимание чему присваиваешь и какие значения используешь в других ф-циях
        self.from_currency = str(input()).upper()
        # <- обрати внимание чему присваиваешь и какие значения используешь в других ф-циях
        self.to_currency = str(input()).upper()
        print('Введите количество переводимой валюты: ')
        # <- обрати внимание чему присваиваешь и какие значения используешь в других ф-циях
        self.amount = int(input())
        while (n <= 0):
            print('Количество не должно равняться нулю или быть отрицательным')
            self.amount = int(input())
        # return a,b,n # <- куда возвращаешь, когда уже присвоил полям экземпляра значения через self?

    def currencyExchange(self):
        # Открытие страницы и получение данных в json формате
        page_object = urllib.request.urlopen(
            'http://openexchangerates.org/api/latest.json?app_id=9f0710764c064370932f4f2496968c62')
        raw_json = page_object.read().decode(encoding='UTF-8')

        # Преобразование json формата в формат, понятный python
        data = json.loads(raw_json)

        """
        Пример работы алгоритма перевода валюты
        1) 1 (USD) = x (RUB) 
        2) 1 (USD) = y (TGN)
        3) 1 (USD) = x (RUB) = y (TGN)
        4) x (RUB) = y (TGN) | : x
        5) 1 (RUB) = y / x (TGN) = z (TGN), z = y / x
        6) amount * 1 (RUB) = amount * z (TGN)
        """

        # Инициализация переменных и подсчёт отношения необходимых курсов через общий курс: USD
        x = 0
        y = 0
        z = 0
        try:
            # <- обрати внимание чему присвоил и какое поле вытягивается здесь
            x = data['rates'][self.from_currency]
            y = data['rates'][self.to_currency]
            z = y / x
        except:
            raise IOError(
                """какой-то из входных параметров не был дан:
                    from_currency = '{0}',
                    to_currency = '{1}' """.format(
                    self.from_currency, self.to_currency))

        # Подсчёт искомого кол-ва денег в необходимой валюте
        self.result = self.amount * z

    def printResult(self):
        print('\n{0} {1} = {2} {3}\n'.format(
            self.amount,
            self.from_currency,
            self.result,
            self.to_currency))  # <- не забудь посмотреть здесь


'''def getData():
		print('Введите индификаторы валют, которую переводите и в которую хотите перевести \n Список индификаторов валют: \n AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN,\n BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND,BOB,BRL,\n BSD,BTC,BTN,BWP,BYN,BZD,CAD,CDF,CHF,CLF,\n CLP,CNH,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,\n DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,\n GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,\n HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,\n JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,\n KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LYD,MAD,\n MDL,MGA,MKD,MMK,MNT,MOP,MRO,MRU,MUR,MVR,\n MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,\n OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,\n RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,\n SLL,SOS,SRD,SSP,STD,STN,SVC,SYP,SZL,THB,\n TJS, TMT, TND, TOP, TRY,TTD,TWD,TZS,UAH,UGX,\n USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,\n XAU,XCD,XDR,XOF,XPD,XPF,XPT,YER,ZAR,ZMW,ZWL')
		a=str(input())
		a=a.upper()
		b=str(input())
		b=b.upper()
		print('Введите количество переводимой валюты: ')
		n=int(input())
		while (n<=0):
			print('Количество не должно равняться нулю или быть отрицательным')
			n=int(input())
		return a,b,n       
       
        


a,b,n=getData()'''

exchanger = Exchanger()
exchanger.getData()
exchanger.currencyExchange()
exchanger.printResult()
