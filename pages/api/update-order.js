import { supabase } from "@/lib/supabase";


export default async function handler(req,res){


  if(req.method !== "POST"){

    return res.status(405).json({
      error:"Method not allowed"
    });

  }



  const {
    id,
    status
  } = req.body;



  if(!id || !status){

    return res.status(400).json({
      error:"Données manquantes"
    });

  }



  const { error } =
    await supabase
    .from("orders")
    .update({
      status
    })
    .eq(
      "id",
      id
    );



  if(error){

    return res.status(500).json({
      error:error.message
    });

  }



  return res.status(200).json({
    success:true
  });


}
