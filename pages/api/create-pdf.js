import { supabase } from "@/lib/supabase";
import { jsPDF } from "jspdf";


export default async function handler(req,res){


  if(req.method !== "POST"){

    return res.status(405).json({
      error:"Method not allowed"
    });

  }



  const { id } = req.body;



  if(!id){

    return res.status(400).json({
      error:"ID manquant"
    });

  }



  const { data:order, error } =
    await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();



  if(error){

    return res.status(500).json({
      error:error.message
    });

  }



  const doc = new jsPDF();



  doc.setFontSize(16);

  doc.text(
    `${order.name}`,
    20,
    20
  );



  doc.setFontSize(11);


  const lines =
    doc.splitTextToSize(
      order.ai_cv,
      170
    );


  doc.text(
    lines,
    20,
    35
  );



  const pdf =
    doc.output("arraybuffer");



  const fileName =
    `cv-${order.id}.pdf`;



  const { error:uploadError } =
    await supabase.storage
    .from("cv-files")
    .upload(
      fileName,
      pdf,
      {
        contentType:
        "application/pdf",

        upsert:true
      }
    );



  if(uploadError){

    return res.status(500).json({
      error:uploadError.message
    });

  }



  const { data:urlData } =
    supabase.storage
    .from("cv-files")
    .getPublicUrl(fileName);



  await supabase
  .from("orders")
  .update({

    pdf_url:
    urlData.publicUrl,

    status:
    "pdf_prêt"

  })
  .eq(
    "id",
    id
  );



  return res.status(200).json({

    success:true,

    pdf:urlData.publicUrl

  });


      }
