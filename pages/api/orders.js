import { parse } from "cookie";
import { supabase } from '../../lib/supabase';


export default async function handler(req,res){


const cookies =
parse(req.headers.cookie || "");



if(
cookies.admin_session !== "authenticated"
){

return res.status(401).json({
error:"Non autorisé"
});

}



  const { data, error } =
    await supabase
    .from("orders")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );



  if(error){

    return res.status(500).json({
      error:error.message
    });

  }



  return res.status(200).json(data);


}
