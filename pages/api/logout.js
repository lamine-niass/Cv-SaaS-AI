import { serialize } from "cookie";


export default function handler(req,res){


res.setHeader(
"Set-Cookie",
serialize(
"admin_session",
"",
{
httpOnly:true,
expires:new Date(0),
path:"/"
}
)
);


res.status(200).json({
success:true
});


}
