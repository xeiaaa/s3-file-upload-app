import { useState } from "react"
import axios from "axios"

function App() {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState(null)  // the current file selected
  const [uploadedFileURL, setUploadedFileURL] = useState(null)  // url of the uploaded file

  const handleChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      return
    }

    try {
      setIsUploading(true)

      // Get S3 signed url
      const { data } = await axios.get("http://localhost:8000/s3-url", {
        params: {
          fileName: file.name,
          fileType: file.type,
        },
      })

      const { signedRequest, url } = data

      // Upload to S3
      await axios.put(signedRequest, file)

      setUploadedFileURL(url)
    } catch (err) {
      console.log(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <p>Uploading: {isUploading.toString()}</p>
      {uploadedFileURL && <img src={uploadedFileURL} />}
    </div>
  )
}

export default App
