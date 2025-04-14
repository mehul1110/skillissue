import streamlit as st
from streamlit_chat import message
from streamlit_extras.colored_header import colored_header
from streamlit_extras.add_vertical_space import add_vertical_space
from PIL import Image
from websocket import create_connection, WebSocketConnectionClosedException

# <-------------------------- Page Configuration -------------------------->
im = Image.open('bot.jpg')
st.set_page_config(layout="wide", page_title="Student's Career Counselling Chatbot", page_icon=im)

# <-------------------------- Main Header -------------------------->
st.markdown(
    """
    <div style="background-color: #FF8C00 ; padding: 10px">
        <h1 style="color: brown; font-size: 48px; font-weight: bold">
           <center> <span style="color: black; font-size: 64px">TheBestCareerGuidanceBot
        </h1>
    </div>
    """,
    unsafe_allow_html=True
)

# <-------------------------- Hide Streamlit Menu -------------------------->
st.markdown(""" 
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
</style> 
""", unsafe_allow_html=True)

# <-------------------------- Sidebar -------------------------->
with st.sidebar:
    st.title(''' SKiLL iSSUE''')
    st.markdown('''
    ## About
    This app has been developed by 
                Mehul Ashra
                (RA2211032010022)
    ''')
    add_vertical_space(2)

# <-------------------------- Session State Initialization -------------------------->
if 'generated' not in st.session_state:
    st.session_state['generated'] = ["I'm an AI Career Counselor, How may I help you?"]
if 'past' not in st.session_state:
    st.session_state['past'] = ['Hi!']
if 'email_requested' not in st.session_state:
    st.session_state['email_requested'] = False
if 'ws' not in st.session_state:
    st.session_state['ws'] = None

# <-------------------------- WebSocket Connection -------------------------->
def get_websocket():
    if st.session_state['ws'] is None:
        try:
            ws = create_connection("ws://localhost:8000/ws/chat")
            st.session_state['ws'] = ws
        except Exception as e:
            st.error(f"WebSocket connection failed: {e}")
            return None
    return st.session_state['ws']

# <-------------------------- Message Handling -------------------------->
def send_and_receive(user_input):
    ws = get_websocket()
    if ws is None:
        return "Backend unavailable. Please try again later."
    try:
        ws.send(user_input)
        while True:
            response = ws.recv()
            if response == "PING":
                continue
            if "Share your email" in response:
                st.session_state['email_requested'] = True
            return response
    except WebSocketConnectionClosedException:
        st.session_state['ws'] = None
        return "Connection closed. Please refresh the page."
    except Exception as e:
        return f"Error: {e}"

# <-------------------------- CSS for Fixed Input and Scrollable Chat -------------------------->
st.markdown("""
    <style>
    .chat-container {
        height: 1vh;
        overflow-y: auto;
        padding-bottom: 10px;
        margin-bottom: 0px;
        border: 1px solid #eee;
        background: #fafafa;
        border-radius: 10px;
    }

    .fixed-input {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        background: white;
        z-index: 9999;
        padding: 0.75rem 0;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
    }

    .block-container {
        padding-bottom: 0px !important;
    }
    </style>
""", unsafe_allow_html=True)

# <-------------------------- Chat History (Scrollable) -------------------------->
if st.session_state['generated']:
    for i in range(len(st.session_state['generated'])):
        message(st.session_state['past'][i], is_user=True, key=str(i) + '_user')
        message(st.session_state['generated'][i], key=str(i))
st.markdown('</div>', unsafe_allow_html=True)

# <-------------------------- Input Bar (Fixed at Bottom) -------------------------->
with st.container():
    cols = st.columns([0.85, 0.15])
    with cols[0]:
        placeholder = "Enter your email..." if st.session_state['email_requested'] else "Type your message..."
        user_input = st.text_input("You: ", key="input", placeholder=placeholder, label_visibility="collapsed", 
                                on_change=None, args=None, kwargs=None)
    with cols[1]:
        submit_button = st.button("Enter", use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

# <-------------------------- Chat Logic -------------------------->
# Check for Enter key press or button click
if submit_button or (user_input and st.session_state.get('input_processed') != user_input):
    if user_input:
        response = send_and_receive(user_input)
        st.session_state['past'].append(user_input)
        st.session_state['generated'].append(response)
        st.session_state['input_processed'] = user_input  # Mark this input as processed
        if st.session_state['email_requested'] and "@" in user_input and "." in user_input:
            st.session_state['email_requested'] = False
        st.rerun()

# JavaScript to submit form on Enter key press
st.markdown("""
<script>
const doc = window.parent.document;
const inputs = doc.querySelectorAll('input[type=text]');

inputs.forEach(input => {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // Get the button element and click it
            const buttons = doc.querySelectorAll('button[kind=secondaryFormSubmit]');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        }
    });
});
</script>
""", unsafe_allow_html=True)