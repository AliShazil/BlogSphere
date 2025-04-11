import ShowSingleBlog from "@/components/ShowSingleBlog"


export default async function Page({ params }) {

    const { slug } = await params
    return (
        <>
            <ShowSingleBlog blogId={slug} />
            
        </> 
    )
}
