import java.util.*;
import org.htmlparser.beans.StringBean;
import org.htmlparser.Node;
import org.htmlparser.NodeFilter;
import org.htmlparser.Parser;
import org.htmlparser.filters.AndFilter;
import org.htmlparser.filters.NodeClassFilter;
import org.htmlparser.tags.LinkTag;
import org.htmlparser.util.NodeList;
import org.htmlparser.util.ParserException;
import org.htmlparser.beans.LinkBean;
import java.net.URL;
public class Crawler {


    private Queue<String> urlQueue = new LinkedList<>(); //urlQueue(Queue): Storing the URL to be crawled

    private HashSet urlSet = new HashSet<String>(); //urlSet: Storing the URL explored


    public Crawler(String initialUrl){    //Constructor
        if(!initialUrl.isEmpty()){
            urlQueue.add(initialUrl);
        }
    }

    public Vector<String> extractLinks() throws ParserException{
        Vector<String> linkExtracted = new Vector<String>();  //Vector storing the url extracted
        LinkBean lb = new LinkBean();
        while(urlQueue.peek() != null) {
            lb.setURL(urlQueue.poll());
            URL[] URL_array = lb.getLinks();
            for(int i = 0; i < URL_array.length; i++){
                String retrievedURL = URL_array[i].toString();
                if(!urlSet.contains(retrievedURL)) {
                    urlSet.add(retrievedURL);
                    linkExtracted.add(retrievedURL);
                    urlQueue.add(retrievedURL);
                }
            }
        }
        return linkExtracted;
    }
    public static void main (String[] args)
    {
        try
        {
            String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";
            Crawler crawler = new Crawler(testURL);



            Vector<String> links = crawler.extractLinks();
            System.out.println("Links in "+testURL+":");
            for(int i = 0; i < links.size(); i++)
                System.out.println(links.get(i));
            System.out.println("");

        } catch (ParserException e)
        {
            e.printStackTrace ();
        }

    }

}
