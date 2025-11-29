import React from 'react'

const EmailTemplate = (formData:FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const grade = formData.get('grade') as string;
    const school = formData.get('school') as string;
    const kinds = formData.get('kinds') as string;
    const date = formData.get('date') as string;

  return (
    <>
        <div className="p-4 font-sans">
            <p className="mb-4">以下の内容でK-PASSの無料受験相談の予約が入りましたので、お知らせいたします。</p>
            
            <table className="w-full border-collapse">
                <tbody>
                <tr>
                    <td className="py-1 pr-2">予約者</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{name}</td>
                </tr>
                <tr>
                    <td className="py-1 pr-2">メールアドレス</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{email}</td>
                </tr>
                <tr>
                    <td className="py-1 pr-2">学年</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{grade}</td>
                </tr>
                <tr>
                    <td className="py-1 pr-2">学校名</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{school}</td>
                </tr>
                <tr>
                    <td className="py-1 pr-2">予約種類</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{kinds}</td>
                </tr>
                <tr>
                    <td className="py-1 pr-2">日程</td>
                    <td className="py-1 px-2">:</td>
                    <td className="py-1 pl-2">{date}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}

export default EmailTemplate
