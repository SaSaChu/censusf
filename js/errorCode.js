const ERRORCODE = {
	"UNIT" : "【單位名稱】不可空白。",
	"B06" : "【負責人姓名】不可空白。",
	"GENDER" : "請選擇【負責人性別】。",
	"B061" : "【聯絡人姓名】不可空白。",
	"B062" : "【聯絡人電話】不可空白。",
	"B063" : "【填表人姓名】不可空白。",
	"B064" : "【填表人電話】不可空白。",
	"B07Z" : "【實際營業地址】不可空白。",
	"B07Z_BR" : "【營業登記地址】不可空白。",
	"_350000" : "請填寫【統一編號】或勾選【確實無統一編號】。",
	"_340000" : "請點選【單位級別】。",
	"_360000" : "請填寫【總管理單位之統一編號。】",
	"_000000" : "請點選問項一【組織別】(1、2、3、4、5)。",
	"_010100" : "實際開業年必須填寫。",
	"_010100-1" : "【實際開業年月】之年份應為民國110年之前；若為民國前開業，請填民國1年。",
	"_010200" : "實際開業月必須填寫。",
	"_010200-1":"【實際開業年月】之月份應為1月~12月。",
	"_030101" : "請選擇(一)【主要經營項目所屬行業】 其中一項。",
	"_030210" : "(二)請點選【以上最主要經營方式為】。",
	"_030253" : "(二)請點選3.【是否附駕駛】。",
	"_030300" : "(三)請點選【是否有從事與主要經營項目不同之業務】。",
	"_030301" : "請選擇【次要經營項目所屬行業】 其中一項。",
	"_030310" : "次要經營項目請點選【以上最主要經營方式為】。",
	"_030353" : "請點選次要經營項目3.【是否附駕駛】。",
	"_040101" : "(一)【僱用員工】(二)【雇主、自營作業者及無酬家屬工作者】其中一項至少填寫1人。",
	"_040101-1" : "(一)【全年薪資總額】有填金額，請一併填寫 (一)【僱用員工】人數。",
	"_040103" : "(一)【僱用員工】有填人數，請一併填寫 (一)【全年薪資總額】。",
	"_040104" : "有無部分工時員工】請點選「(1)有」或「(2)無。",
	"_0401045" : "(一)【2.有無部分工時員工】點選「(1)有」或「(2)無」，請續填人數。",
	"_050100" : "(一)【全年有無使用派遣人力】請點選「1.有」或「2.無」。",
	"_050101" : "(一)【全年有無使用派遣人力】點選「1.有」，請填寫「使用月數(1~12)」。",
	"_050102" : "(一)【全年有無使用派遣人力】點選「1.有」，請填寫「通常使用人數」。",
	// "_050101" : "(一)【全年有無使用派遣人力】點選「1.有」，請填寫「12月份使用人數」，若無請補0",
	"_050200" : "(二)【全年有無經營勞動派遣業務】請點選「1.有」或「2.無」。",
	"_050201" : "(二)【全年有無經營勞動派遣業務】點選「1.有」，請填寫「派遣月數(1~12)」。",
	"_050202" : "(二)【全年有無經營勞動派遣業務】點選「1.有」，請填寫「通常派遣人數」。",
	// "_050201" : "(二)【全年有無經營勞動派遣業務】點選「1.有」，請填寫「12月份使用人數」，若無請補0",
	"_060100" : "(一)【有無使用電腦或網路設備 】，請點選「1.有」或「2.無」。",
	"_060200" : "(二)【有無透過網路提供營業資訊】，請點選「1.有」或「2.無」。",
	"_060300" : "(三)【有無透過網路進行產品或服務之銷售或接單】，請點選「1.有」或「2.無」。",
	"_060311" : "(三)【有無透過網路進行產品或服務之銷售或接單】選「1.有」，請續填1A~1C。",
	"_060400" : "(四)【有無提供銷售交易之行動支付功能】，請點選「1.有」或「2.無」。",
	"_060500" : "(五)【全年有無採行下列資安措施】，請點選「1.有」或「2.無」。",
	"_060501" : "(五)【全年有無採行下列資安措施】選「1.有」，請至少勾選一項採用資安項目。",
	"_060600" : "(六)【電腦或網路設備使用方式】，請點選「1.基礎」或「2.進階」。",
	"_060611" : "(六)【電腦或網路設備使用方式】選「2.進階」，請續填2A.。",
	"_060612" : "(六)【電腦或網路設備使用方式】選「2.進階」，請續填2B.。",
	"_060613" : "(六)2B【有運用智慧化技術】選「1.有」，智慧化技術(1)~(5)至少須點選一項。",
	"_060621" : "【有運用智慧化技術】點選(1)，須選擇主要運用作業1~7至少一項。",
	"_060631" : "【有運用智慧化技術】點選(2)，須選擇主要運用作業1~7至少一項。",
	"_060641" : "【有運用智慧化技術】點選(3)，須選擇主要運用作業1~7至少一項。",
	"_060651" : "【有運用智慧化技術】點選(4)，須選擇主要運用作業1~7至少一項。",
	"_060661" : "【有運用智慧化技術】點選(5)，須選擇主要運用作業1~7至少一項。",	
	"_060670" : "【主要運用作業，項目一及項目二值不可選擇相同 】",
	"_069999" : "要運用作業項目有填選代號7.其他，請填寫7.其他項之說明",
	"_070100" : "(一)【有無研究發展支出】，請點選「1.有」或「2.無」。",
	"_070200" : "(二)【有無自有品牌經營】，請點選「1.有」或「2.無」。",
	"_070300" : "(三)1.【有無產品或服務創新】，請點選「1.有」或「2.無」。",
	"_070400" : "(三)2.【有無製程或服務後檯作業創新】，請點選「1.有」或「2.無」。",
	"_070500" : "(三)3.【有無行銷、組織策略或管理方式創新】，請點選「1.有」或「2.無」。",
	"_080000" : "【有無跨國(境)服務交易、投資布局或外資持股？ 】，請點選「1.有」或「2.無」。",
	"_080100" : "(一)【跨國服務或勞務交易】，請點選「1.有」或「2.無」。",
	"_080101" : "(一)【跨國服務或勞務交易】，請點選「僅有採購(輸入)」、「僅有提供(輸出)」或「兩者皆有」其中一項。",
	"_080200" : " (二)【有無外資股東】，請點選「(1)有」或「(2)無」，若選「(1)有」請續填股東數及持股比率。",
	"_080201" : " (二)【有無外資股東】，若選「(1)有」請續填股東數。",
	"_080202" : " (二)【有無外資股東】，若選「(1)有」請續填持股比率。",
	"_080300" : " (三)【有無國外分支單位】，請點選「(1)有」或「(2)無」，若選「(1)有」請續填分支單位家數。",
	"_080301" : "(三)【有無國外分支單位】，若選「(1)有」請續填分支單位家數。",
	"_080400" : "(四)【有無對國外企業具有控制能力】，請點選「(1)有」或「(2)無」，若選「(1)有」請續填家數。",
	"_080401" : "(四)【有無對國外企業具有控制能力】，若選「(1)有」請續填家數。",
	"_090101" : "請填寫「全年總成本及費用」，若無請補0。",
	"_090102" : "請填寫「全年總收入」，若無請補0。",
	"_090200" : "(二)【有無設會計帳】請點選「1.有」或「2.無」。" ,
	"_090201" : "(二)【有無設會計帳】若選「1.有」請續填「年底資產總計」金額。",
	"_090202" : "(二)【有無設會計帳】若選「1.有」請續填「投資性不動產」金額，若無「投資性不動產」請補0。",
	"_090300" : "(三)【年底有無租借用固定資產 】請點選「1.有」或「2.無」。",
	"_100001" : "(一)【商品銷售對象】，請點選「1.一般家庭民眾」或「2.機關行號」至少其中一項。",
	"_100100" : "(一)【商品銷售對象】有點選「1.一般家庭民眾」，則請勾選(二)【商品銷售管道】1~8至少其中一項。",
	"_100899" : "(二)【商品銷售管道】有勾選「8.其他」，請續填其他之說明。",
	"_110100" : "(一)【有無外銷業務 】，請點選「1.有」或「2.無」。",
	"_110200" : "【有無三(多)角貿易 】，請點選「1.有」或「2.無」。",
	"_110201" : "【有無三(多)角貿易 】，若選「1.有」請續填「銷售收入」。",
	"_110202" : "【有無三(多)角貿易 】，若選「1.有」請續填「銷售成本」。",
	"_120100" : "(一)，請點選「1.有」或「2.無」。",
	"_120200" : "(二)，請點選「1.有」或「2.無」。",
	"_120300" : "(三)，請點選「1.有」或「2.無」。",
	"_130000" : "請填寫靠行司機人數，若無請補0。",
	"_130400" : "勾選1.受疫情影響，請填寫 (1)~(4)受影響之資料。",
	"_130411" : "勾選(1)曾停業，請填寫停業天數。",
	"_130422" : "勾選(3)全年營業收入增加，請填寫增加百分比。",
	"_130423" : "勾選(3)全年營業收入減少，請填寫減少百分比。",
	"_130425" : "勾選(3)全年薪資支出增加，請填寫增加百分比。",
	"_130426" : "勾選(3)全年薪資支出減少，請填寫減少百分比。",
	"_130599" : "勾選2.其他特殊情形，請填寫文字說明。",
}